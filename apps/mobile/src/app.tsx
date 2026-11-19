import { ScrollView, StyleSheet, Text, View } from 'react-native';
export default function App() {
  return <ScrollView contentContainerStyle={styles.page} contentInsetAdjustmentBehavior="automatic"><View style={styles.content}><Text accessibilityRole="header" style={styles.title}>HomeLearn</Text><Text style={styles.body}>Learning that fits your family.</Text><Text style={styles.body}>Your family workspace is being built. Account setup and learning plans will be available in a later milestone.</Text></View></ScrollView>;
}
const styles = StyleSheet.create({ page: { flexGrow: 1, padding: 24, backgroundColor: '#f7f5ef', justifyContent: 'center' }, content: { width: '100%', maxWidth: 720, alignSelf: 'center', gap: 20 }, title: { fontSize: 36, fontWeight: '700', color: '#183e36' }, body: { fontSize: 18, lineHeight: 28, color: '#253b36' } });
