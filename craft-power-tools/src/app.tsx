import * as React from "react"
import * as ReactDOM from 'react-dom'
import { Header } from "./pages/header";
import { Page, PageMode } from "./pages/page";
import { initConsole } from "./console";
import './style.css';

const App: React.FC<{}> = () => {
  const [mode, setMode] = React.useState<PageMode>("main");
  
  const backButtonCallback = React.useCallback(() => {
    setMode("main");
  }, [mode]);

  return <div className="flex flex-col h-screen">
    <Header mode={mode} backSelected={backButtonCallback}/>
    <Page mode={mode} setMode={setMode}/>
  </div>;
};

craft.env.setListener((env) => {
  if (env.colorScheme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
});

export function initApp() {
  ReactDOM.render(<App />, document.getElementById("react-root"));
  initConsole();
}
