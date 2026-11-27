import { useState } from 'react';
import { HomeLearnPrototype } from './prototype';
import { LocalApiWorkflow } from './features/local-api/LocalApiWorkflow';

export default function App() {
  const [showLocalApi, setShowLocalApi] = useState(false);
  return showLocalApi
    ? <LocalApiWorkflow initialScreen="workspace" onBackToPrototype={() => setShowLocalApi(false)} />
    : <HomeLearnPrototype
      onOpenApi={() => setShowLocalApi(true)}
    />;
}
