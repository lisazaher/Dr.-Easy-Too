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
const diseases = ['Cancer','Herpes Simplex','Common Cold','The Flu','Diabetes'];
const expl = ['Cancer is a type of disease where cells grow out of control, divide and invade other tissues. In a person without cancer, \
cell division is under control. In most tissues, healthy cells divide in a controlled way and copy themselves to create new healthy cells.\
With cancer, this normal process of cell division goes out of control.',
'The herpes simplex virus is a virus that causes two common diseases. Both diseases have painful, watery blisters in the skin or mucous membranes\
 (such as the mouth or lips) or on the genitals.',
'The common cold is an easily spread infectious disease of the upper respiratory system. It damages mostly the nose and throat. The symptoms include\
 cough, painful throat, runny nose, and fever. These symptoms usually last seven to ten days, but sometimes up to three weeks. Over two\
  hundred different viruses can cause the common cold, but rhinoviruses are the most common cause.',
'Influenza, better known as the flu and sometimes called the grippe, is a common childhood illness, but is not as common among adults.  Symptoms \
include cough, sore throat, muscle aches and pains, fever, headache, and rarely vomiting and diarrhoea.',
'Diabetes is a condition that results from lack of the hormone insulin in a person\'s blood, or when the body has a problem using the insulin it produces.\
 People with diabetes mellitus are called "diabetics".'];
const treatment_options = ['Chemotherapy', 'Nothing', 'Rest', 'Vaccination', 'Insulin', 'Surgery', 'Antibiotics'];
const treatment_plan = ['Chemotherapy, or \'chemo\', is the use of chemical substances to treat diseases. The word "chemotherapy" is often used for a type of medicine used to treat cancer. The drugs are cytotoxic, which means they are toxic to the body\'s cells.',
'There is no cure to herpes simplex. It will go away after a while on its own, although the patient will remain infected with the virus, even with no visible sore.',
'Resting and consuming fluids is essential to a speedy recovery from the common cold. Chicken soup and soothing tea are common home remedies that people have used for many years.',
'Being vaccinated against the seasonal flu is the best way to prevent becoming ill. Bed rest and medicine can help patients recover more easily.',
'There is no cure for diabetes, but blood sugar can be regulated by administering insulin to the patient. This will prevent the symptoms of diabetes and allow the patient to live normally.',
'Surgery will be required to remove the tumour. When people have operations they are normally put to sleep with general anaesthesia. When the patients are asleep, they cannot feel any pain.',
'An antibiotic (or antibacterial) is a chemical compound that kills bacteria or slows their growth. They are used as medicine to treat and cure diseases caused by bacteria.'];

var i = 0;
var j = 0;
// Import the Dialogflow module from the Actions on Google client library.
const {dialogflow, Permission, Suggestions} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

//admin stuff
const admin = require('firebase-admin');

/*
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://hackdata-55e47.firebaseio.com'
  });*/

admin.initializeApp();
const db = admin.firestore();
const collectionRef = db.collection('diseases');

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
            //conv.add(expl[i]);
            conv.ask('Are you ready to move to the treatment plan?');
            conv.ask(new Suggestions('Yes', 'No'));
            break;
        }
    }
  });

app.intent('begin_diagnosis - yes', (conv) => {
    conv.ask('Ok, please begin describing the treatment.');
});

app.intent('begin_treatment_plan', (conv, {treatment}, {time}) => { //{treatment}, {time}
    for (; j < treatment_options.length; j++) {
        if (treatment_options[j] == treatment) {
            break;
        }
    }

    let data = {
        name: diseases[i],
        explanation: expl[i],
        treatment: treatment_options[j],
        treatment_plan: treatment_plan[j],
    };
      
    // Add a new document in collection "cities" with ID 'LA'
    let setDoc = collectionRef.doc('Last Appointment Information').set(data);   
    conv.close('Thank you. Head to the website to view my report.');
});


// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);
