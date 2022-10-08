import Cookies from 'vue-cookie';
import axios from 'axios';
import request from '@/api/request';
import { sxqxzk,treecx} from "@/api/power/institution";
import { saveObjArr} from "@/router";


export function setToken(){
	let refreshs = Cookies.get('refresh_token');
	axios({
      url: request.adornUrl(`/authorization/oauth/token?grant_type=refresh_token&refresh_token=${refreshs}`),
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic dGVzdF9jbGllbnQ6dGVzdF9zZWNyZXQ='
      }
    }).then(res => {
    	Cookies.set('token', res.data.access_token);
      	Cookies.set('refresh_token', res.data.refresh_token);
    })
}


export function localPub(){
	if (!localStorage.getItem('regTree')) {
		sxqxzk().then(res => {
			saveObjArr('regTree', res.data.children)
		});
	}
	if (!localStorage.getItem('insData')) {
		treecx().then(res => {
			saveObjArr('insData', res.data)
		})
	}
}
