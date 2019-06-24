import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

    private messageSource = new BehaviorSubject('default message');
    currentMessage = this.messageSource.asObservable();

    constructor() { }

    async changeMessage(message: string) {
        this.messageSource.next(message)
    }

}