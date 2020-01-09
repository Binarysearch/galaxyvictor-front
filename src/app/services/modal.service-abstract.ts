import { Type, ViewRef } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class ModalService {

    public abstract getWindows(): Observable<ViewRef>;

    public abstract getOnBack(): Observable<void>;
    
    public abstract getOnCloseAll(): Observable<void>;

    public abstract openWindow<T>(component: Type<T>, data?: any): void;

    public abstract back(): void;

    public abstract closeAll(): void;

}

export abstract class Modal {

    public abstract close(): void;

}