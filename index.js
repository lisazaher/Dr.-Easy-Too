// Copyright 2018, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an 'AS IS' BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';
const diseases = ['cancer','herpes','cold','flu','diabetes'];
const expl = ['Cancer is a type of disease where cells grow out of control, divide and invade other tissues. In a person without cancer,\
cell division is under control. In most tissues, healthy cells divide in a controlled way and copy themselves to create new healthy cells.\
With cancer, this normal process of cell division goes out of control.',
'The herpes simplex virus is a virus that causes two common diseases. Both diseases have painful, watery blisters in the skin or mucous membranes\
 (such as the mouth or lips) or on the genitals.',
'The common cold is an easily spread infectious disease of the upper respiratory system. It damages mostly the nose and throat. The symptoms include\
 cough, painful throat, runny nose (rhinorrhea), and fever. These symptoms usually last seven to ten days, but sometimes up to three weeks. Over two\
  hundred different viruses can cause the common cold, but rhinoviruses are the most common cause.',
'Influenza, better known as the flu and sometimes called the grippe, is a common childhood illness, but is not as common among adults.  Symptoms \
include cough, sore throat, muscle aches and pains, fever, headache, and rarely vomiting and diarrhoea.',
'Diabetes is a condition that results from lack of the hormone insulin in a person\'s blood, or when the body has a problem using the insulin it produces.\
 People with diabetes mellitus are called "diabetics".'];
const treatment_plan = ['get fucked. ;)','There is no cure to herpes simplex. It will go away after a while on its own, although the patient will remain infected with the virus.',
'Resting and consuming fluids is essential to a speedy recovery from the common cold. Finger lickin\' good chicken soup and soothing tea are common remedies for this.',
'Being vaccinated against the seasonal flu is the best way to prevent becoming ill. Bed rest and medicine can help patients recover more easily.',
'There is no cure for diabetes, but blood sugar can be regulated by administering insulin to the patient. This will prevent the symptoms of diabetes and allow the patient to live normally.'];

var i = 0;
// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow, Permission, Suggestions} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Handle the Dialogflow intent named 'Default Welcome Intent'.
app.intent('Default Welcome Intent', (conv) => {
    conv.add('I\'m ready to help. Please begin with the patient\'s diagnosis.');
  });
// Handle the Dialogflow intent named 'favorite color'.
// The intent collects a parameter named 'color'
app.intent('begin_diagnosis', (conv, {disease}) => {
    for (; i < diseases.length; i++) {
        if (diseases[i] === disease) {
            //conv.user.storage.treatment_plan =  disease;
            conv.add(expl[i]);
            conv.ask('Are you ready to move to the treatment plan?');
            conv.ask(new Suggestions('Yes', 'No'));
            break;
        }
    }
  });

app.intent('begin_diagnosis - yes', (conv) => {
    //transcribe text
    /*for (var i = 0; i < diseases.length; i++) {
        if (diseases[i] === disease) {
            //conv.user.storage.treatment_plan =  disease;
            conv.add(treatment_plan[i]);
            break;
        }
    }&*/
    conv.ask('Ok, please begin.');
});

app.intent('begin_treatment_plan', (conv, {treatment}, {time}) => {
    /*for (var i = 0; i < diseases.length; i++) {
        if (diseases[i] === disease) {
            //conv.user.storage.treatment_plan =  disease;
            conv.add(treatment_plan[i]);
            break;
        }
    }*/
    conv.add('here is your treatment plan');
    conv.close(treatment_plan[i]);
});


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
