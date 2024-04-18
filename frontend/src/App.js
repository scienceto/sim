import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './components/About';
import Contact from './components/Contact';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Console from './components/Console';
// Imports the Amplify library from 'aws-amplify' package. This is used to configure your app to interact with AWS services.
import { Amplify } from 'aws-amplify';

// Imports the Authenticator and withAuthenticator components from '@aws-amplify/ui-react'.
// Authenticator is a React component that provides a ready-to-use sign-in and sign-up UI.
// withAuthenticator is a higher-order component that wraps your app component to enforce authentication.
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';

// Imports the default styles for the Amplify UI components. This line ensures that the authenticator looks nice out of the box.
import '@aws-amplify/ui-react/styles.css';

// Imports the awsExports configuration file generated by the Amplify CLI. This file contains the AWS service configurations (like Cognito, AppSync, etc.) specific to your project.
import awsExports from './aws-exports';

// Configures the Amplify library with the settings from aws-exports.js, which includes all the AWS service configurations for this project.
Amplify.configure(awsExports);

function App() {
  return (
    <div className="App">
      <Authenticator socialProviders={['amazon', 'apple', 'facebook', 'google']}>
        {({ signOut }) => (
          <main>
            <Router>
              <Header handleSignOut={signOut} />
              <Routes>
                <Route
                  path='/'
                  element={<Home />}
                />
                <Route
                  path='/about'
                  element={<About />}
                />
                <Route
                  path='/contact'
                  element={<Contact />}
                />
                <Route
                  path='/console'
                  element={<Console />}
                />
              </Routes>
            </Router>
          </main>
        )}
      </Authenticator>
      <Footer />
    </div>
  );
}

export default withAuthenticator(App);