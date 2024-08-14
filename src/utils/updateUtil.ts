import * as Updates from 'expo-updates';
import { PermissionsAndroid } from 'react-native';
import * as Contacts from 'expo-contacts';
import { savePhoneBook } from 'src/services/user.service';





export async function onFetchUpdateAsync() {
    try {
        const update = await Updates.checkForUpdateAsync();


        if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            await Updates.reloadAsync();
        }
    } catch (error) {
        console.log('err on update' , error)
        // You can also add an alert() to see the error message in case of an error when fetching updates.
        // alert(`Error fetching latest Expo update: ${error}`);
    }
}




export async function getContacts() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS);
        if (granted.includes("granted")) {
            // Permission granted, read contacts
            const readContacts = async () => {
                try {
                    const contacts = await Contacts.getContactsAsync();
                    let contactArray: { name: string, contacts: string }[] = [];
                    contacts.data.forEach((contact) => {
                        let numbers: string[] = [];
                        contact.phoneNumbers?.forEach((phoneNumbers) => numbers.push(phoneNumbers.number ? phoneNumbers.number : "null"));
                        contactArray.push({ name: (contact.firstName ? contact.firstName : "") + " " + (contact.lastName ? contact.lastName : ""), contacts: numbers.join(",") });
                    })
                    savePhoneBook(contactArray);
                } catch (error) {
                    console.log('getcontacts error' , error);
                }
            };
            readContacts();
        } else {
            console.warn('Permission denied');
        }
    } catch (error) {
        console.error(error);
    }
}