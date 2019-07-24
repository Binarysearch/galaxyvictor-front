import { Subject, Observable } from 'rxjs';

export class NgSocket {

    private ws: WebSocket;
    private subject: Subject<string>;
    private url: string;
    private retryTimeout: number;
    private messageQueue: string[] = [];
    private autoConnect: boolean;

    constructor(url: string, retryTimeout: number) {
        this.subject = new Subject();
        this.url = url;
        this.retryTimeout = retryTimeout;
    }

    public connect(): Observable<string> {
        this.autoConnect = true;
        this._connect();
        return this.subject.asObservable();
    }

    public disconnect() {
        this.autoConnect = false;
        this.ws.close();
    }

    public send(msg: string) {
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(msg);
        } else {
            this.messageQueue.push(msg);
        }
    }

    private _connect() {
        this.ws = new WebSocket(this.url);
        this.ws.onmessage = this.onMessage.bind(this);
        this.ws.onclose = this.onClose.bind(this);
        this.ws.onerror = this.onError.bind(this);
        this.ws.onopen = this.onOpen.bind(this);
    }

    private onClose(event: CloseEvent) {
        if (this.autoConnect) {
            setTimeout(() => {
                this._connect();
            }, this.retryTimeout);
        }
    }

    private onMessage(msg: MessageEvent) {
        this.subject.next(msg.data);
    }

    private onOpen(event: Event) {
        this.flush();
    }

    private onError(error: Event) {
        console.log(error);
    }

    private flush() {
        this.messageQueue = this.messageQueue.filter(msg => {
            if (this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(msg);
                return false;
            }
            return true;
        });
    }
}