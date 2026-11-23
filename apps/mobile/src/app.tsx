import { useState } from 'react';
import { HomeLearnPrototype } from './prototype';
import { LocalApiWorkflow } from './features/local-api/LocalApiWorkflow';

export default function App() {
  const [showLocalApi, setShowLocalApi] = useState(false);
  const [startAtCatalogue, setStartAtCatalogue] = useState(false);
  return showLocalApi
    ? <LocalApiWorkflow initialScreen={startAtCatalogue ? 'catalogue' : 'workspace'} onBackToPrototype={() => setShowLocalApi(false)} />
    : <HomeLearnPrototype
      onOpenApi={() => { setStartAtCatalogue(false); setShowLocalApi(true); }}
      onOpenCatalogue={() => { setStartAtCatalogue(true); setShowLocalApi(true); }}
    />;
}
