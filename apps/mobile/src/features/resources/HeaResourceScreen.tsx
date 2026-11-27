import { useRef, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';

const HEA_FREE_RESOURCES_URL = 'https://www.hea.edu.au/free';

export function HeaResourceScreen({ onClose }: { readonly onClose: () => void }) {
  const webViewRef = useRef<WebView<unknown>>(null);
  const [loadUrl, setLoadUrl] = useState(HEA_FREE_RESOURCES_URL);
  const [currentUrl, setCurrentUrl] = useState(HEA_FREE_RESOURCES_URL);
  const [canGoBack, setCanGoBack] = useState(false);
  const [hasError, setHasError] = useState(false);

  const goBack = () => {
    if (canGoBack) {
      webViewRef.current?.goBack();
      return;
    }
    onClose();
  };

  const handleNavigationChange = (navigation: WebViewNavigation) => {
    if (isHttpsUrl(navigation.url)) setCurrentUrl(navigation.url);
    setCanGoBack(navigation.canGoBack);
    setHasError(false);
  };

  const openInSafari = async () => {
    if (!isHttpsUrl(currentUrl)) return;
    try {
      await Linking.openURL(currentUrl);
    } catch {
      setHasError(true);
    }
  };

  return <SafeAreaView style={styles.screen}>
    <View style={styles.header}>
      <Pressable accessibilityRole="button" onPress={goBack} style={styles.backButton}>
        <Text style={styles.backText}>{canGoBack ? '‹  Back' : '‹  Lessons'}</Text>
      </Pressable>
      <Text accessibilityRole="header" style={styles.title}>Free learning resources</Text>
      <Text style={styles.subtitle}>A directory provided by Home Education Association</Text>
    </View>
    {hasError ? <View style={styles.error}>
      <Text style={styles.errorTitle}>This page could not be displayed here.</Text>
      <Text style={styles.errorBody}>Some websites limit in-app browsing. You can try again or open this page in Safari.</Text>
      <Pressable accessibilityRole="button" onPress={() => { setLoadUrl(currentUrl); setHasError(false); }} style={styles.actionButton}>
        <Text style={styles.actionText}>Try again</Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={openInSafari} style={styles.secondaryButton}>
        <Text style={styles.secondaryText}>Open in Safari</Text>
      </Pressable>
    </View> : <WebView<unknown>
      ref={webViewRef}
      source={{ uri: loadUrl }}
      style={styles.webView}
      originWhitelist={['*']}
      javaScriptCanOpenWindowsAutomatically={false}
      mixedContentMode="never"
      setSupportMultipleWindows
      startInLoadingState
      renderLoading={() => <View style={styles.loading}><ActivityIndicator color="#285b4e" /><Text style={styles.loadingText}>Loading HEA resources…</Text></View>}
      onNavigationStateChange={handleNavigationChange}
      onShouldStartLoadWithRequest={request => isHttpsUrl(request.url)}
      onOpenWindow={event => {
        const targetUrl = event.nativeEvent.targetUrl;
        if (isHttpsUrl(targetUrl)) {
          setCurrentUrl(targetUrl);
          setHasError(false);
          webViewRef.current?.injectJavaScript(`window.location.href = ${JSON.stringify(targetUrl)}; true;`);
        }
      }}
      onError={() => setHasError(true)}
      onHttpError={event => {
        if (event.nativeEvent.statusCode >= 400) setHasError(true);
      }}
    />}
  </SafeAreaView>;
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f7f5ef' },
  header: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e3e6df', gap: 5 },
  backButton: { alignSelf: 'flex-start', paddingVertical: 5, paddingRight: 14 },
  backText: { color: '#285b4e', fontSize: 16, fontWeight: '700' },
  title: { color: '#183e36', fontSize: 21, fontWeight: '700' },
  subtitle: { color: '#52645c', fontSize: 13, lineHeight: 18 },
  webView: { flex: 1, backgroundColor: '#f7f5ef' },
  loading: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#f7f5ef' },
  loadingText: { color: '#52645c', fontSize: 14 },
  error: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 28, gap: 12 },
  errorTitle: { color: '#183e36', fontSize: 20, fontWeight: '700', textAlign: 'center' },
  errorBody: { color: '#52645c', fontSize: 15, lineHeight: 22, textAlign: 'center' },
  actionButton: { marginTop: 6, borderRadius: 9, paddingHorizontal: 18, paddingVertical: 12, backgroundColor: '#285b4e' },
  actionText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryButton: { paddingHorizontal: 18, paddingVertical: 10 },
  secondaryText: { color: '#285b4e', fontSize: 15, fontWeight: '700' },
});
