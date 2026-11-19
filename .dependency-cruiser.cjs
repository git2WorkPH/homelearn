module.exports = {
  forbidden: [
    { severity: 'error', name: 'no-cycles', from: {}, to: { circular: true } },
    { severity: 'error', name: 'domain-is-pure', from: { path: '/domain/' }, to: { pathNot: '/domain/', dependencyTypesNot: ['local'] } },
    { severity: 'error', name: 'domain-no-outer-layer', from: { path: '/domain/' }, to: { path: '/(application|infrastructure|presentation)/' } },
    { severity: 'error', name: 'application-no-adapters', from: { path: '/application/' }, to: { path: '/(infrastructure|presentation)/' } },
    { severity: 'error', name: 'mobile-no-server', from: { path: '^apps/mobile/' }, to: { path: '^apps/api/|(?:^|/)@prisma/' } },
    { severity: 'error', name: 'module-public-interface', from: { path: '^apps/api/src/modules/([^/]+)/' }, to: { path: '^apps/api/src/modules/(?!$1/)[^/]+/(?!index\\.[cm]?[jt]s$)' } }
  ],
  options: { doNotFollow: { path: 'node_modules' }, exclude: '(^|/)(dist|node_modules|generated|\\.expo)/', tsPreCompilationDeps: true }
};
