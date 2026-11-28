import { useState } from 'react';
import { HomeLearnPrototype } from './prototype';
import { ParentLogin } from './features/auth/ParentLogin';

export default function App() {
  const [showLocalApi, setShowLocalApi] = useState(false);
  return showLocalApi
    ? <ParentLogin initialScreen="workspace" onBack={() => setShowLocalApi(false)} />
    : <HomeLearnPrototype
      onOpenApi={() => setShowLocalApi(true)}
    />;
}
