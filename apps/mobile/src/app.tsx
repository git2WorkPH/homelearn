import { useCallback, useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://127.0.0.1:3000';
type Plan = { id: string; title: string; startsOn: string; endsOn: string };
type Activity = { id: string; title: string; learnerIds: string[]; schedule?: { startsAt: string } };
type Experience = { id: string; title: string; happenedAt: string };
type LearningRecord = { id: string; experienceId: string; learnerId: string; completed: boolean; observation?: string };
async function request<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, { ...(body === undefined ? {} : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }) });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}
const id = () => `demo-${Date.now()}`;
export default function App() {
  const [plans, setPlans] = useState<Plan[]>([]); const [activities, setActivities] = useState<Activity[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]); const [records, setRecords] = useState<LearningRecord[]>([]);
  const [title, setTitle] = useState('Learning this week'); const [message, setMessage] = useState(''); const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => { try { const [p,a,e,r] = await Promise.all([request<Plan[]>('/api/v1/plans'),request<Activity[]>('/api/v1/activities'),request<Experience[]>('/api/v1/learning-experiences'),request<LearningRecord[]>('/api/v1/learner-records')]); setPlans(p);setActivities(a);setExperiences(e);setRecords(r);setMessage(''); } catch { setMessage('Start the local HomeLearn API to load and save demo learning data.'); } }, []);
  useEffect(() => { const timer = setTimeout(() => { void refresh(); }, 0); return () => clearTimeout(timer); }, [refresh]);
  const createPlan = async () => { setBusy(true); try { const today=new Date();const end=new Date(today);end.setDate(today.getDate()+6);await request('/api/v1/plans',{id:id(),familyId:'local-demo',title:title.trim()||'Learning this week',startsOn:today.toISOString().slice(0,10),endsOn:end.toISOString().slice(0,10),status:'active'});await refresh(); } catch { setMessage('Could not save the plan. Check the local API.'); } finally { setBusy(false); } };
  const recordLearning = async () => { setBusy(true); try { const experienceId=id(); await request('/api/v1/learning-experiences',{id:experienceId,familyId:'local-demo',happenedAt:new Date().toISOString(),title:'Unplanned learning'}); await request('/api/v1/learner-records',{id:id(),experienceId,learnerId:'learner-a',completed:true,observation:'Add a parent observation'}); await refresh(); } catch { setMessage('Could not save the learning record. Check the local API.'); } finally { setBusy(false); } };
  return <ScrollView contentContainerStyle={styles.page}><View style={styles.content}>
    <Text accessibilityRole="header" style={styles.title}>HomeLearn</Text><Text style={styles.body}>Plan learning and record what happens.</Text>
    {message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}
    <Text accessibilityRole="header" style={styles.heading}>Weekly plans</Text><TextInput accessibilityLabel="Plan title" style={styles.input} value={title} onChangeText={setTitle}/><Button title="Create a weekly plan" disabled={busy} onPress={()=>void createPlan()}/>
    {plans.map(plan=><Text key={plan.id} style={styles.item}>{plan.title} · {plan.startsOn}–{plan.endsOn}</Text>)}
    <Text accessibilityRole="header" style={styles.heading}>Activities</Text>{activities.map(item=><Text key={item.id} style={styles.item}>{item.title} · {item.learnerIds.length} learners · {item.schedule?'scheduled':'flexible'}</Text>)}
    <Text accessibilityRole="header" style={styles.heading}>Learning records</Text><Button title="Record unplanned learning" disabled={busy} onPress={()=>void recordLearning()}/>
    {experiences.map(item=><View key={item.id} style={styles.card}><Text style={styles.item}>{item.title}</Text>{records.filter(record=>record.experienceId===item.id).map(record=><Text key={record.id} style={styles.body}>{record.learnerId}: {record.observation??(record.completed?'Completed':'Observed')}</Text>)}</View>)}
    <Button title="Refresh" disabled={busy} onPress={()=>void refresh()}/>
  </View></ScrollView>;
}
const styles=StyleSheet.create({page:{flexGrow:1,padding:24,backgroundColor:'#f7f5ef'},content:{width:'100%',maxWidth:720,alignSelf:'center',gap:14},title:{fontSize:36,fontWeight:'700',color:'#183e36'},heading:{fontSize:24,fontWeight:'600',color:'#183e36',marginTop:12},body:{fontSize:16,lineHeight:24,color:'#253b36'},item:{fontSize:16,color:'#183e36',paddingVertical:8},input:{borderWidth:1,borderColor:'#87958f',borderRadius:8,padding:12,backgroundColor:'#fff'},message:{color:'#9a3412'},card:{padding:12,borderRadius:8,backgroundColor:'#fff'}});
