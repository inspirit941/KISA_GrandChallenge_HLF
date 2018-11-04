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
    
    const newView = factory.newResource(NS, "ViewData","V-"+InputData.sid.slice(0,4)+"-"+String(Timenow));
    newView.uid = InputData.uid;
    newView.sid = InputData.sid;
    newView.gender = InputData.gender;
    newView.age = InputData.age;
    newView.url = InputData.url;
    newView.referer = InputData.referer;
    newView.width = InputData.width;
    newView.height = InputData.height;
    newView.title = InputData.title;
    newView.timestamp = InputData.timestamp;
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
    // 실제 asset구분하는 id값은 이 timestamp변환값 + sid slice 일부.
    
    const newEvent = factory.newResource(NS, "EventData","E-"+InputData.sid.slice(0,4)+"-"+String(Timenow));
    newEvent.uid = InputData.uid;
    newEvent.sid = InputData.sid;
    newEvent.gender = InputData.gender;
    newEvent.age = InputData.age;
    newEvent.url = InputData.url;
    newEvent.referer = InputData.referer;
    newEvent.width = InputData.width;
    newEvent.height = InputData.height;
    newEvent.title = InputData.title;
    newEvent.timestamp = InputData.timestamp;
    newEvent.channel = InputData.channel;
    newEvent.duration = InputData.duration;
    newEvent.uptime = InputData.uptime;
    
    newEvent.action = InputData.action;
    // 만약 action이 label값을 바탕으로 결정되는 거라면 함수로 만들면 됨.
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
