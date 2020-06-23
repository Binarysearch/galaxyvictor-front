import { PirosApiService, ConnectionStatus, ChannelConnection } from '@piros/api';
import { Subscription, Subject } from 'rxjs';

export function subscribeToNotifications<T>(api: PirosApiService, channelName: string, subject: Subject<T>) {

    let channelConnection: ChannelConnection<T>;
    let messagesSubscription: Subscription;
    let connectToChannelSubscription: Subscription;


    api.getStatus().subscribe(status => {
        if (status.connectionStatus === ConnectionStatus.FULLY_CONNECTED) {

            if (channelConnection) {
                channelConnection.close();
            }

            if (messagesSubscription) {
                messagesSubscription.unsubscribe();
            }

            if (connectToChannelSubscription) {
                connectToChannelSubscription.unsubscribe();
            }

            connectToChannelSubscription = api.connectToChannel<T>(channelName).subscribe(connection => {
                channelConnection = connection;
                messagesSubscription = connection.messages.subscribe(message => {
                    subject.next(message);
                });
            });
        }
    });
}