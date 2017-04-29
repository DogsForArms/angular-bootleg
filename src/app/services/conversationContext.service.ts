import { Injectable } from '@angular/core'
import { Http } from '@angular/http'
import { environment } from '../../environments/environment'
import 'rxjs/add/operator/map'

const CONVERSATION_CONTEXT_SAVE_PATH = '/conversationContext/1/save'

@Injectable()
export class ConversationContextService {
  constructor(private http: Http){
    console.log('ConversationContextService Initialized...' + environment.apiRoot)
  }

  save(body: ConversationContextSaveParams | null) {
    const url = environment.apiRoot + CONVERSATION_CONTEXT_SAVE_PATH;
    return this.http.post( url, body )
      .map(res => res.json())
  }
}

export interface ConversationContextSaveParams {
    id?: number
    conversationId: number
    context?: any
}

export interface ConversationContextSaveResponse {
  id: number
}
