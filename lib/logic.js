/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
/**
 * Write your transction processor functions here
 */


/**
 * ViewDataCreate
 * @param {org.platform.data.ViewDataCreate} ViewDataCreate
 * @transaction
 */
async function ViewDataCreate(InputData) {
    const NS = "org.platform.data";
    const factory = getFactory();
    const Timenow = Date.parse(InputData.timestamp);
    // 실제 asset구분하는 id값은 이 timestamp변환값 + sid slice 일부.
    
    const newView = factory.newResource(NS, "ViewData","V-"+InputData.sid.slice(4,8)+"-"+String(Timenow));
    newView.uid = InputData.uid;
    newView.sid = InputData.sid;
    newView.gender = InputData.gender;
    newView.age = InputData.age;
    newView.url = InputData.url;
    newView.referer = InputData.referer;
    newView.width = InputData.width;
    newView.height = InputData.height;
    newView.title = InputData.title;
    newView.time = InputData.time;
    newView.channel = InputData.channel;
    newView.duration = InputData.duration;
    newView.uptime = InputData.uptime;
    
    const assetRegistry = await getAssetRegistry(NS + ".ViewData");
    await assetRegistry.add(newView);

    const UserRegistry = await getParticipantRegistry(NS+".User");
    const exist = await UserRegistry.exists(InputData.sid);
    
    if (exist == false){
        const newUser = factory.newResource(NS, "User", InputData.sid);
        newUser.uid = InputData.uid;
        newUser.gender = InputData.gender;
        newUser.age = InputData.age;
        newUser.url = [InputData.url];
        newUser.referer = InputData.referer;
        newUser.titles = [InputData.title];
        newUser.channels = [InputData.channel];
        newUser.timestamp = InputData.timestamp;
        await UserRegistry.add(newUser);
    } else{
        
        const User = await UserRegistry.get(InputData.sid);
        if (User.titles.includes(InputData.title)==false){
            User.titles.push(InputData.title);
        }
        if (User.channels.includes(InputData.channel)==false){
            User.channels.push(InputData.channel);
        }
        if (User.url.includes(InputData.url)==false){
            User.url.push(InputData.url);
        }
        await UserRegistry.update(User);
    }
    const NumericRegistry = await getAssetRegistry(NS+".NumericValue");

    const exist2 = await NumericRegistry.exists(InputData.title);
    if (exist2 == false){
        const NewNumeric = factory.newResource(NS, "NumericValue",InputData.title);
        NewNumeric.totalView+=1;

        if (exist == false){ //세션 단위로 수치가 올라갈 것들은 이 아래에
            NewNumeric.sessions+=1;
            if (InputData.gender == true){NewNumeric.male+=1;}
            if (InputData.gender == false){NewNumeric.female+=1;}
            if (InputData.age < 20){NewNumeric.age10+=1;}
            else if (InputData.age <25){NewNumeric.age2024+=1;}
            else if (InputData.age <30){NewNumeric.age2529+=1;}
            else if (InputData.age <35){NewNumeric.age3034+=1;}
            else if (InputData.age <40){NewNumeric.age3539+=1;}
            else if (InputData.age <45){NewNumeric.age4044+=1;}
            else if (InputData.age <50){NewNumeric.age4549+=1;}
            else if (InputData.age <55){NewNumeric.age5054+=1;}
            else if (InputData.age <60){NewNumeric.age5559+=1;}
            else {NewNumeric.age60+=1;}

            const lengthBymin = parseInt(InputData.duration / 60); 
            // 배열 index 총합이 될 값.
            var PerminList = new Array();
            for(var i=0; i<lengthBymin; i++){
                if (parseInt(InputData.uptime / 60)==i){
                    PerminList.push(1);
                } else{
                    PerminList.push(0);
                }
            }
            NewNumeric.ViewPermin = PerminList;

        }
        await NumericRegistry.add(NewNumeric);   
    } else {
        const Numeric = await NumericRegistry.get(InputData.title);
        Numeric.totalView+=1;

        if (exist == false){ // 새 세션이 만들어졌을 경우. 세션 단위로 단위가 올라가는 것은 아래에.
            Numeric.sessions+=1;
            if (InputData.gender == true){Numeric.male+=1;}
            if (InputData.gender == false){Numeric.female+=1;}

            if (InputData.age < 20){Numeric.age10+=1;}
            else if (InputData.age <25){Numeric.age2024+=1;}
            else if (InputData.age <30){Numeric.age2529+=1;}
            else if (InputData.age <35){Numeric.age3034+=1;}
            else if (InputData.age <40){Numeric.age3539+=1;}
            else if (InputData.age <45){Numeric.age4044+=1;}
            else if (InputData.age <50){Numeric.age4549+=1;}
            else if (InputData.age <55){Numeric.age5054+=1;}
            else if (InputData.age <60){Numeric.age5559+=1;}
            else {Numeric.age60+=1;}
        }
        var index = parseInt(InputData.uptime / 60);
        Numeric.ViewPermin[index]+=1;
        await NumericRegistry.update(Numeric);
    } 
}

/**
 * Sample transaction
 * @param {org.platform.data.EventDataCreate} EventDataCreate
 * @transaction
 */
async function EventDataCreate(InputData) {
    const NS = "org.platform.data";
    const factory = getFactory();
    const Timenow = Date.parse(InputData.timestamp);
    const newEvent = factory.newResource(NS, 
        "EventData","E-"+InputData.sid.slice(4,8)+"-"+String(Timenow));
    newEvent.uid = InputData.uid;
    newEvent.sid = InputData.sid;
    newEvent.gender = InputData.gender;
    newEvent.age = InputData.age;
    newEvent.url = InputData.url;
    newEvent.referer = InputData.referer;
    newEvent.width = InputData.width;
    newEvent.height = InputData.height;
    newEvent.title = InputData.title;
    newEvent.time = InputData.time;
    newEvent.channel = InputData.channel;
    newEvent.duration = InputData.duration;
    newEvent.uptime = InputData.uptime;
    newEvent.action = InputData.action;
    newEvent.label = InputData.label;
    const assetRegistry = await getAssetRegistry(NS + ".EventData");
    await assetRegistry.add(newEvent);
}

// /**
//  * Simple Aggreation by txn
//  * @param {org.platform.data.getData} getData
//  * @transaction
//  */
// async function getData(input) {
//     // Save the old value of the asset.
    
//     const assetRegistry = await getAssetRegistry("org.platform.data.ViewData");
//     const getAllViewData = await assetRegistry.getAll();
//     let male, female = 0;
//     for( var ViewData in getAllViewData){
//         if (ViewData.title == input){
//             if (ViewData.gender ==true){
//                 male+=1;
//             } else{
//                 female+=1;
//             }
//         }
//     };
//     // getallViewData.foreach(function(ViewData){
        
//     result = {"count":[{"male":male, "female":female}]};
//     return result;
// }


/**
 * Sample transaction
 * @param {org.platform.data.SampleTransaction} sampleTransaction
 * @transaction
 */
async function sampleTransaction(tx) {
    // Save the old value of the asset.
    const oldValue = tx.asset.value;

    // Update the asset with the new value.
    tx.asset.value = tx.newValue;

    // Get the asset registry for the asset.
    const assetRegistry = await getAssetRegistry('org.platform.data.SampleAsset');
    // Update the asset in the asset registry.
    await assetRegistry.update(tx.asset);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('org.platform.data', 'SampleEvent');
    event.asset = tx.asset;
    event.oldValue = oldValue;
    event.newValue = tx.newValue;
    emit(event);
}
