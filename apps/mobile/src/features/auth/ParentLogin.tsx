import { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { authClient } from '../../services/auth-client';
import { LocalApiWorkflow } from '../local-api/LocalApiWorkflow';

export function ParentLogin({ onBack, initialScreen }: { readonly onBack: () => void; readonly initialScreen: 'workspace' | 'catalogue' }) {
  const session = authClient.useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  if (session.isPending) {
    return <SafeAreaView style={styles.safe}><Text style={styles.body}>Checking your session…</Text></SafeAreaView>;
  }
  if (session.data !== null) {
    return <LocalApiWorkflow initialScreen={initialScreen} onBackToPrototype={onBack} onSignOut={() => { void authClient.signOut(); }} />;
  }

  const signIn = async () => {
    setIsBusy(true);
    setMessage('');
    try {
      const result = await authClient.signIn.email({ email: email.trim(), password });
      if (result.error !== null) setMessage('Unable to sign in. Check your email, password, and API connection.');
      else setPassword('');
    } catch {
      setMessage('Unable to sign in. Check your email, password, and API connection.');
    } finally {
      setIsBusy(false);
    }
  };

  return <SafeAreaView style={styles.safe}><View style={styles.card}>
    <Text accessibilityRole="header" style={styles.title}>Parent login</Text>
    <Text style={styles.body}>Sign in to your HomeLearn family account.</Text>
    <TextInput accessibilityLabel="Email address" autoCapitalize="none" autoComplete="email" keyboardType="email-address" style={styles.input} placeholder="Email address" value={email} onChangeText={setEmail} editable={!isBusy} />
    <TextInput accessibilityLabel="Password" autoComplete="current-password" secureTextEntry style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} editable={!isBusy} onSubmitEditing={() => { void signIn(); }} />
    {message ? <Text accessibilityRole="alert" style={styles.error}>{message}</Text> : null}
    <Button title={isBusy ? 'Signing in…' : 'Sign in'} disabled={isBusy || email.trim() === '' || password === ''} onPress={() => { void signIn(); }} />
    <Text style={styles.caption}>Account creation is available only through the local setup command.</Text>
    <Button title="Back to HomeLearn" onPress={onBack} />
  </View></SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f7f5ef' },
  card: { width: '100%', maxWidth: 440, alignSelf: 'center', gap: 16, padding: 24, borderRadius: 16, backgroundColor: '#fff' },
  title: { fontSize: 30, fontWeight: '700', color: '#183e36' },
  body: { fontSize: 16, lineHeight: 24, color: '#253b36' },
  input: { borderWidth: 1, borderColor: '#87958f', borderRadius: 8, padding: 12, backgroundColor: '#fff' },
  error: { color: '#9a3412' },
  caption: { fontSize: 13, lineHeight: 19, color: '#68756d' },
});
