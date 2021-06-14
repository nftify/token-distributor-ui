import React from 'react';
import { Redirect, Switch, BrowserRouter } from "react-router-dom";
import Layout from "src/app/components/layout/Layout";
import { ROUTES } from "src/app/configs/constants";
import useSettingUpAccount from "src/app/hooks/useSettingUpAccount";
import GlobalErrorBoundary from "src/app/components/error-boundaries/GlobalErrorBoundary";
import Home from "src/app/components/home/Home";
import { ModalListener } from "src/app/components/commons/ModalListener";

const App: React.FC = () => {
  useSettingUpAccount();

  return (
    <div className="app">
      <GlobalErrorBoundary>
        <BrowserRouter>
          <Switch>
            <Layout path={ROUTES.HOME} component={Home} exact={false}/>
            <Redirect to={ROUTES.HOME}/>
          </Switch>
        </BrowserRouter>
        <ModalListener/>
      </GlobalErrorBoundary>
    </div>
  )
};

export default App;
