import { Injectable } from '@angular/core';
import { Subject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BPCPODHeader, BPCPODView, BPCPODItem, BPCReasonMaster } from 'app/models/POD';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PODService {
    baseAddress: string;
    NotificationEvent: Subject<any>;

    GetNotification(): Observable<any> {
        return this.NotificationEvent.asObservable();
    }

    TriggerNotification(eventName: string): void {
        this.NotificationEvent.next(eventName);
    }

    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService
    ) {
        this.baseAddress = _authService.baseAddress;
        this.NotificationEvent = new Subject();
    }

    // Error Handler
    errorHandler(error: HttpErrorResponse): Observable<string> {
        return throwError(error.error instanceof Object ? error.error.Message ? error.error.Message : error.error : error.error || error.message || 'Server Error');
    }

    GetAllPODs(): Observable<BPCPODHeader[] | string> {
        return this._httpClient.get<BPCPODHeader[]>(`${this.baseAddress}poapi/POD/GetAllPODs`)
            .pipe(catchError(this.errorHandler));
    }

    GetAllPODByPartnerID(PartnerID: string): Observable<BPCPODHeader[] | string> {
        return this._httpClient.get<BPCPODHeader[]>(`${this.baseAddress}poapi/POD/GetAllPODByPartnerID?PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetPODByPartnerID(PartnerID: string): Observable<BPCPODHeader | string> {
        return this._httpClient.get<BPCPODHeader>(`${this.baseAddress}poapi/POD/GetPODByPartnerID?PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetPODsByDoc(DocNumber: string): Observable<BPCPODHeader[] | string> {
        return this._httpClient.get<BPCPODHeader[]>(`${this.baseAddress}poapi/POD/GetPODsByDoc?DocNumber=${DocNumber}`)
            .pipe(catchError(this.errorHandler));
    }
    GetPODsByDocAndPartnerID(DocNumber: string, PartnerID: string): Observable<BPCPODHeader[] | string> {
        return this._httpClient.get<BPCPODHeader[]>(`${this.baseAddress}poapi/POD/GetPODsByDocAndPartnerID?DocNumber=${DocNumber}&PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }
    GetPODByInvAndPartnerID(InvoiceNumber: string, PartnerID: string): Observable<BPCPODHeader | string> {
        return this._httpClient.get<BPCPODHeader>
            (`${this.baseAddress}poapi/POD/GetPODByInvAndPartnerID?InvoiceNumber=${InvoiceNumber}&PartnerID=${PartnerID}`)
            .pipe(catchError(this.errorHandler));
    }

    GetPODByPOD(PODNumber: string): Observable<BPCPODHeader | string> {
        return this._httpClient.get<BPCPODHeader>(`${this.baseAddress}poapi/POD/GetPODByPOD?PODNumber=${PODNumber}`)
            .pipe(catchError(this.errorHandler));
    }

    CreatePOD(POD: BPCPODView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}poapi/POD/CreatePOD`,
            POD,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    UpdatePOD(POD: BPCPODView): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}poapi/POD/UpdatePOD`,
            POD,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }

    DeletePOD(POD: BPCPODHeader): Observable<any> {
        return this._httpClient.post<any>(`${this.baseAddress}poapi/POD/DeletePOD`,
            POD,
            {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json'
                })
            })
            .pipe(catchError(this.errorHandler));
    }
    GetPODItemsByPOD(PODNumber: string): Observable<BPCPODItem[] | string> {
        return this._httpClient.get<BPCPODItem[]>(`${this.baseAddress}poapi/POD/GetPODItemsByPOD?PODNumber=${PODNumber}`)
            .pipe(catchError(this.errorHandler));
    }
    GetAllReasonMaster(): Observable<BPCReasonMaster[] | string> {
        return this._httpClient.get<BPCReasonMaster[]>(`${this.baseAddress}poapi/Master/GetAllReasonMaster`)
            .pipe(catchError(this.errorHandler));
    }

    AddPODItemAttachment(DocNumber: string, InvoiceNumber: string, CreatedBy: string, selectedFiles: File[]): Observable<any> {
        const formData: FormData = new FormData();
        if (selectedFiles && selectedFiles.length) {
            selectedFiles.forEach(x => {
                formData.append(x.name, x, x.name);
            });
        }
        formData.append('DocNumber', DocNumber);
        formData.append('InvoiceNumber', InvoiceNumber);
        // formData.append('Item', Item);
        formData.append('CreatedBy', CreatedBy.toString());

        return this._httpClient.post<any>(`${this.baseAddress}poapi/POD/AddPODItemAttachment`,
            formData,
            // {
            //   headers: new HttpHeaders({
            //     'Content-Type': 'application/json'
            //   })
            // }
        ).pipe(catchError(this.errorHandler));
    }

    DowloandPODItemAttachment(AttachmentName: string): Observable<Blob | string> {
        return this._httpClient.get(`${this.baseAddress}poapi/POD/DowloandPODItemAttachment?AttachmentName=${AttachmentName}`, {
            responseType: 'blob',
            headers: new HttpHeaders().append('Content-Type', 'application/json')
        })
            .pipe(catchError(this.errorHandler));
    }
}
