const site = 'https://lodestartabletop.com';
const auth = 'https://sncysyzvoxstxffaokcj.supabase.co/auth/v1/verify';
const failure = { kind: 'error' };
const unique = (params, allowed) => [...params.keys()].every(key => allowed.includes(key) && params.getAll(key).length === 1);

// Fixed destinations only. No email contents, tokens or provider errors become HTML.
export function resolveAuthPage(mode, rawURL) {
  const url = new URL(rawURL);
  if (mode === 'continue') {
    if (url.search) return failure;
    const params = new URLSearchParams(url.hash.slice(1));
    if (!unique(params, ['token_hash', 'type'])) return failure;
    const token = params.get('token_hash') ?? '';
    const type = params.get('type');
    if (!/^pkce_[a-fA-F0-9]{32,128}$/.test(token) || !['signup', 'recovery'].includes(type)) return failure;
    const route = type === 'signup' ? 'callback' : 'recovery';
    const target = new URL(auth);
    target.searchParams.set('token', token);
    target.searchParams.set('type', type);
    target.searchParams.set('redirect_to', `${site}/auth/${route}.html`);
    return { kind: 'verify', target: target.href };
  }
  if (!['callback', 'recovery'].includes(mode) || url.hash) return failure;
  if (!unique(url.searchParams, ['code', 'error', 'error_code', 'error_description'])) return failure;
  if (url.searchParams.has('error') || url.searchParams.has('error_code')) return failure;
  const code = url.searchParams.get('code') ?? '';
  if (!/^[a-z0-9_-]{1,2048}$/i.test(code)) return failure;
  const target = new URL(`com.smbarne.lodestar://auth/${mode}`);
  target.searchParams.set('code', code);
  return { kind: 'open', target: target.href };
}
