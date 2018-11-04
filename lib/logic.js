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
 * Sample transaction
 * @param {org.platform.data.ViewDataCreate} ViewDataCreate
 * @transaction
 */
async function ViewDataCreate(InputData) {
    const NS = "org.platform.data";
    const factory = getFactory();
    const Timenow = Date.parse(InputData.timestamp);
    // 실제 asset구분하는 id값은 이 timestamp변환값 + 무언가가 더 필요함.
    const sidparse = InputData.sid;
    const newView = factory.newResource(NS, "ViewData",sidparse[0,4]+String(Timenow));
    
    newView.uid = InputData.uid;
    newView.sid = sidparse;
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
}



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
