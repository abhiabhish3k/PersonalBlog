// Supabase-backed data layer. Getters read from an in-memory cache so the
// existing page components can remain synchronous; initializeStorage() must
// finish before the app renders.
import { INITIAL_SETTINGS } from './constants.js';
import { requireSupabase } from './supabase.js';

const state = {
  stories: [],
  settings: { ...INITIAL_SETTINGS },
  media: [],
  messages: [],
  subscribers: [],
  adminAuth: null,
};

const listeners = new Set();
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function notify() {
  listeners.forEach((fn) => fn());
}

function throwIfError(error, fallback) {
  if (error) throw new Error(error.message || fallback || 'Supabase request failed.');
}

function mapMedia(row) {
  const fileName = row.path?.split('/').pop() || 'Image asset';
  return { ...row, name: row.name || fileName, type: row.content_type || row.type || '', size: row.size_bytes || row.size || 0 };
}

export function subscribeStorage(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

async function loadData(isAdmin) {
  const supabase = requireSupabase();
  const [settingsResult, storiesResult] = await Promise.all([
    supabase.from('settings').select('*').eq('id', 1).maybeSingle(),
    supabase.from('posts').select('*').order('created_at', { ascending: false }),
  ]);
  throwIfError(settingsResult.error, 'Could not load blog settings.');
  throwIfError(storiesResult.error, 'Could not load blog posts.');

  state.settings = settingsResult.data || { ...INITIAL_SETTINGS };
  state.stories = storiesResult.data || [];

  if (isAdmin) {
    const [mediaResult, messagesResult, subscribersResult] = await Promise.all([
      supabase.from('media').select('*').order('created_at', { ascending: false }),
      supabase.from('messages').select('*').order('created_at', { ascending: false }),
      supabase.from('subscribers').select('*').order('created_at', { ascending: false }),
    ]);
    throwIfError(mediaResult.error, 'Could not load the media library.');
    throwIfError(messagesResult.error, 'Could not load contact messages.');
    throwIfError(subscribersResult.error, 'Could not load newsletter subscribers.');
    state.media = (mediaResult.data || []).map(mapMedia);
    state.messages = messagesResult.data || [];
    state.subscribers = subscribersResult.data || [];
  } else {
    state.media = [];
    state.messages = [];
    state.subscribers = [];
  }
  notify();
}

async function resolveAdminSession(session) {
  const supabase = requireSupabase();
  if (!session?.user) {
    state.adminAuth = null;
    return false;
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle();

  if (error || profile?.role !== 'admin') {
    // A logged-in reader must not receive an admin UI session.
    await supabase.auth.signOut();
    state.adminAuth = null;
    return false;
  }

  state.adminAuth = {
    id: session.user.id,
    email: session.user.email || '',
    role: profile.role,
  };
  return true;
}

export async function initializeStorage() {
  const supabase = requireSupabase();
  const { data, error } = await supabase.auth.getSession();
  throwIfError(error, 'Could not restore the Supabase session.');
  const isAdmin = await resolveAdminSession(data.session);
  await loadData(isAdmin);
  return { adminUser: state.adminAuth };
}

export async function signInAdmin(email, password) {
  const supabase = requireSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  throwIfError(error, 'Email or password is incorrect.');

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError || profile?.role !== 'admin') {
    await supabase.auth.signOut();
    state.adminAuth = null;
    notify();
    throw new Error('This account does not have administrator access.');
  }

  state.adminAuth = { id: data.user.id, email: data.user.email || '', role: profile.role };
  try {
    await loadData(true);
  } catch (error) {
    await supabase.auth.signOut();
    state.adminAuth = null;
    notify();
    throw error;
  }
  return state.adminAuth;
}

export async function signOutAdmin() {
  const supabase = requireSupabase();
  const { error } = await supabase.auth.signOut();
  throwIfError(error, 'Could not sign out.');
  state.adminAuth = null;
  await loadData(false);
  notify();
}

export async function sendAdminPasswordReset(email) {
  const supabase = requireSupabase();
  const redirectTo = `${window.location.origin}/admin/reset`;
  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
  throwIfError(error, 'Could not send the password reset email.');
}

export async function updateAdminPassword(password) {
  const supabase = requireSupabase();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  throwIfError(sessionError, 'Could not verify the current session.');
  if (!sessionData.session) {
    throw new Error('Open the password reset link from your email before setting a new password.');
  }
  const { error } = await supabase.auth.updateUser({ password });
  throwIfError(error, 'Could not update the password.');
}

// Synchronous cache getters (refreshes happen via notify() after remote requests).
export function getStories() {
  return [...state.stories];
}

export function getPublishedStories() {
  const now = Date.now();
  return getStories()
    .filter((story) => story.status === 'published' ||
      (story.status === 'scheduled' && story.published_at && new Date(story.published_at).getTime() <= now))
    .sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime());
}

export function getStoryBySlug(slug) {
  return state.stories.find((story) => story.slug === slug);
}

export function getStoryById(id) {
  return state.stories.find((story) => story.id === id);
}

export async function saveStory(storyData) {
  const supabase = requireSupabase();
  const now = new Date().toISOString();
  const payload = {
    title: storyData.title,
    slug: storyData.slug,
    excerpt: storyData.excerpt || '',
    body_html: storyData.body_html || '',
    body_json: storyData.body_json ?? null,
    category: storyData.category || 'Essay',
    tags: Array.isArray(storyData.tags) ? storyData.tags : [],
    status: storyData.status || 'draft',
    featured: Boolean(storyData.featured),
    theme: storyData.theme || 'sage',
    reading_font: storyData.reading_font || 'serif',
    cover_url: storyData.cover_url || null,
    read_minutes: Math.max(1, Number(storyData.read_minutes) || 1),
    published_at: storyData.published_at || null,
    updated_at: now,
  };

  let result;
  if (storyData.id && UUID_RE.test(storyData.id)) {
    result = await supabase.from('posts').update(payload).eq('id', storyData.id).select('*').single();
  } else {
    result = await supabase.from('posts').insert({ ...payload, created_at: now }).select('*').single();
  }
  throwIfError(result.error, 'Could not save the story.');

  const row = result.data;
  const index = state.stories.findIndex((story) => story.id === row.id);
  if (index >= 0) state.stories[index] = row;
  else state.stories.unshift(row);
  notify();
  return row;
}

export async function deleteStory(id) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('posts').delete().eq('id', id);
  throwIfError(error, 'Could not delete the story.');
  state.stories = state.stories.filter((story) => story.id !== id);
  notify();
}

export function getSettings() {
  return { ...state.settings };
}

export async function updateSettings(newSettings) {
  const supabase = requireSupabase();
  const allowed = [
    'blog_name', 'tagline', 'author_name', 'contact_email', 'bio', 'currently',
    'writes_about', 'github_url', 'x_url', 'linkedin_url', 'portrait_url', 'default_theme',
  ];
  const payload = { id: 1 };
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(newSettings, key)) payload[key] = newSettings[key];
  }
  const { data, error } = await supabase.from('settings').update(payload).eq('id', 1).select('*').single();
  throwIfError(error, 'Could not save the blog settings.');
  state.settings = data;
  notify();
  return data;
}

export function getMedia() {
  return [...state.media];
}

export async function uploadMediaFile(file) {
  const supabase = requireSupabase();
  if (!state.adminAuth) throw new Error('Sign in as an administrator to upload images.');
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
  if (!allowedTypes.includes(file.type)) throw new Error('Only PNG, JPG, WebP, and GIF images are supported.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image must be under 5 MB.');

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-');
  const path = `${state.adminAuth.id}/${crypto.randomUUID()}-${safeName}`;
  const { error: uploadError } = await supabase.storage.from('media').upload(path, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: false,
  });
  throwIfError(uploadError, 'Could not upload the image.');

  const { data: urlData } = supabase.storage.from('media').getPublicUrl(path);
  const { data, error } = await supabase.from('media').insert({
    path, url: urlData.publicUrl, name: file.name, content_type: file.type, size_bytes: file.size,
  }).select('*').single();
  if (error) {
    await supabase.storage.from('media').remove([path]);
    throwIfError(error, 'The image uploaded, but its media record could not be saved.');
  }
  const item = mapMedia(data);
  state.media.unshift(item);
  notify();
  return item;
}

export async function deleteMediaItem(id) {
  const supabase = requireSupabase();
  const item = state.media.find((media) => media.id === id);
  if (item?.path) {
    const { error: storageError } = await supabase.storage.from('media').remove([item.path]);
    throwIfError(storageError, 'Could not remove the image file from storage.');
  }
  const { error } = await supabase.from('media').delete().eq('id', id);
  throwIfError(error, 'Could not delete the media record.');
  state.media = state.media.filter((media) => media.id !== id);
  notify();
}

export function getSubscribers() {
  return [...state.subscribers];
}

export async function addSubscriber(email) {
  const supabase = requireSupabase();
  const normalized = email.trim().toLowerCase();
  // Do not request returned rows here: public visitors may insert, but must not
  // have SELECT access to the private subscriber list.
  const { error } = await supabase
    .from('subscribers')
    .upsert({ email: normalized }, { onConflict: 'email', ignoreDuplicates: true });
  throwIfError(error, 'Could not subscribe this email address.');
  if (state.adminAuth) await loadData(true);
  return true;
}

export function getMessages() {
  return [...state.messages];
}

export async function addMessage({ name, email, body }) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('messages').insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    body: body.trim(),
  });
  // A public visitor is allowed to insert a message but is not allowed to read
  // the inbox, so intentionally do not request the inserted row back.
  throwIfError(error, 'Could not send your message. Please try again.');
  if (state.adminAuth) await loadData(true);
  else notify();
  return true;
}

export async function deleteMessage(id) {
  const supabase = requireSupabase();
  const { error } = await supabase.from('messages').delete().eq('id', id);
  throwIfError(error, 'Could not delete the message.');
  state.messages = state.messages.filter((message) => message.id !== id);
  notify();
}

export function getAdminAuth() {
  return state.adminAuth;
}

export function exportAllData() {
  const data = {
    exported_at: new Date().toISOString(),
    blog: getSettings(),
    stories: getStories(),
    media: getMedia(),
    subscribers: getSubscribers(),
    messages: getMessages(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `abhi-writes-export-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
