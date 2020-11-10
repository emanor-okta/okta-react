/*!
 * Copyright (c) 2017-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { AuthService, Security, LoginCallback, SecureRoute } from '@okta/okta-react';
import Home from './Home';
import Protected from './Protected';
import CustomLogin from './CustomLogin';
import SessionTokenLogin from './SessionTokenLogin';

if (!AuthService) {
  throw new Error('AuthService should be defined');
}

export default function App({ pkce, redirectUri, customLogin }) {
  const navigate = useNavigate();
  const { ISSUER, CLIENT_ID } = process.env;

  function onAuthRequired() {
    navigate('/login');
  }

  return (
    <React.StrictMode>
      <Security issuer={ISSUER}
                clientId={CLIENT_ID}
                disableHttpsCheck={true}
                redirectUri={redirectUri}
                onAuthRequired={customLogin ? onAuthRequired : undefined}
                pkce={pkce}>
        <Routes>
          <Route path='/login' element={<CustomLogin />}/>
          <Route path='/sessionToken-login' element={<SessionTokenLogin />}/>
          <SecureRoute path='/protected' element={<Protected />}/>
          <Route path='/implicit/callback' element={<LoginCallback />} />
          <Route path='/pkce/callback' element={<LoginCallback />} />
          <Route path='/*' element={<Home />}/>
        </Routes>
      </Security>
      <a href="/?pkce=1">PKCE Flow</a> | <a href="/">Implicit Flow</a>
    </React.StrictMode>
  );
}

