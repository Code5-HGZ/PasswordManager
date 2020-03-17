classificationList=[]
accountList=[]
$(document).ready(function(){initClassificationMenu("/classification/all");initAccountTable("/account/get/所有账号");initClassificationPopup();$("#functionButtonAddAccount").click(function(){initAccountPopup(false);});});function popup(html,style){let body=$("body");template='\
        <div id="popupOcclude"> \
            <div id="popupBox"> \
                <div id="popup" style="{{popupStyle}}"> \
                    <div id="popupClose">\
                        <svg t="1583482970163" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8288" width="20" height="20"> \
                            <path d="M512 0C228.43 0 0 228.43 0 512s228.43 512 512 512 512-228.43 512-512S795.57 0 512 0z m208.738 673.477c11.816 11.815 11.816 31.508 0 39.385-11.815 11.815-31.507 11.815-39.384 0L519.877 551.385 358.4 712.862c-11.815 11.815-31.508 11.815-39.385 0-11.815-11.816-11.815-31.508 0-39.385L480.492 512 319.015 350.523c-7.877-11.815-7.877-27.57 0-39.385 11.816-11.815 31.508-11.815 39.385 0l161.477 161.477 161.477-161.477c11.815-11.815 31.508-11.815 39.384 0 11.816 11.816 11.816 31.508 0 39.385L559.262 512l161.476 161.477z" p-id="8289" fill="#a85d52"></path> \
                        </svg> \
                    </div>\
                    {{html}} \
                </div> \
            </div> \
        </div> \
    ';let css="";for(let i=0;i<style.length;i++){css+=style[i]}
template=template.replace("{{popupStyle}}",css);template=template.replace("{{html}}",html);body.append(template);$("#popupClose").click(function(){$("#popupOcclude").remove();});}
function initClassificationMenu(apiUrl){$.ajax({type:"GET",url:apiUrl,success:function(responseData){if(responseData["code"]!=0){spop({template:responseData["msg"],style:'error',autoclose:5000,position:'top-right',icon:true,});}else{classificationList=responseData["result"];}
let classificationMenu=$("#classification");classificationMenu.empty();for(let i=0;i<responseData["result"].length;i++){classificationMenu.append('<li>'+responseData["result"][i]+"<span></span></li>")}
classificationMenu.children().click(function(){let me=$(this);let siblings=me.siblings();for(let i=0;i<siblings.length;i++){$(siblings[i]).children("span").hide();}
me.children("span").show();let url="/account/get/"+me.text();initAccountTable(url);});}});}
function initAccountTable(apiUrl){let accountTable=$("#accountTable");$.ajax({type:"GET",url:apiUrl,success:function(responseData){if(responseData["code"]!=0){spop({template:responseData["msg"],style:'error',autoclose:5000,position:'top-right',icon:true,});return false;}else{accountList=responseData["result"];}
accountTable.empty();let counter=0;let tableHead='\
                <tr>\
                    <th>账号名称</th>\
                    <th>创建日期</th>\
                    <th>最后修改日期</th>\
                </tr>\
            '
let template='\
                <tr class={{background}} id="aid{{aid}}" onclick="initAccountPopup(\'{{aid}}\')">   \
                    <td>{{name}}</td>\
                    <td>{{createDate}}</td>\
                    <td>{{updateDate}}</td>\
                </tr>  \
            '
accountTable.append(tableHead);for(let i=0;i<responseData["result"].length;i++){temporary=template.replace(/{{aid}}/g,responseData["result"][i]["aid"]);temporary=temporary.replace("{{name}}",responseData["result"][i]["name"]);temporary=temporary.replace("{{createDate}}",responseData["result"][i]["createDate"]);temporary=temporary.replace("{{updateDate}}",responseData["result"][i]["updateDate"]);if(counter==0){temporary=temporary.replace("{{background}}","table-bright");counter=1;}else{temporary=temporary.replace("{{background}}","table-dark");counter=0;}
accountTable.append(temporary);}}});}
function initClassificationPopup(){$("#classificationManagment").click(function(){let r=[];let template=' \
        <div id="classificationPopup">  \
            <h3>分类管理</h3> \
            <hr> \
            <table>   \
            {{items}} \
            </table>  \
            <div id="functionButton"> \
                <button type="button" id="functionButtonAdd">添加分类</button> \
                <button type="button" id="functionButtonSave">保存修改</button> \
            </div> \
        </div> \
        '
let items=""
let temporary=""
for(let i=0;i<classificationList.length;i++){temporary=' \
                <tr> \
                    <td><input value="{{classificationName}}"></td>\
                    <td> \
                        <button type="button" class="functionButtonRemove">删除</button> \
                    </td>\
                </tr> \
            ';temporary=temporary.replace("{{classificationName}}",classificationList[i]);items+=temporary;}
template=template.replace("{{items}}",items);popup(template,[]);$("#functionButtonAdd").click(function(){let template=' \
                <tr> \
                    <td><input class="new" placeholder="请输入新的分类的名称"></td>\
                    <td> \
                        <button type="button" class="functionButtonRemove" id="{{randomId}}">删除</button> \
                    </td>\
                </tr> \
            ';let randomId=(new Date()).valueOf();template=template.replace("{{randomId}}",randomId);$("#classificationPopup table").append(template);$("#"+randomId).click(function(){$(this).parent().parent().remove();});});$("#functionButtonSave").click(function(){let success=true;let inputList=$("#classificationPopup table").find("input");let o=[];let n=[];let a=[];for(let i=0;i<inputList.length;i++){let input=$(inputList[i]);if(input.hasClass("new")){a.push($.trim(input.val()));}else{o.push($.trim(input.attr("value")));n.push($.trim(input.val()));}}
for(let i=0;i<o.length;i++){if(o[i]!=n[i]){$.ajax({type:"GET",async:false,url:"classification/update/"+o[i]+"/"+n[i],error:function(e){spop({template:"更新分类 \""+o[i]+"\" 失败",style:'error',autoclose:3000,position:'top-right',icon:true,});success=false;},success:function(responseData){if(responseData["code"]!=0){spop({template:responseData["msg"],style:'error',autoclose:3000,position:'top-right',icon:true,});success=false;}}});}}
for(let i=0;i<a.length;i++){$.ajax({type:"GET",async:false,url:"classification/add/"+a[i],error:function(e){spop({template:"添加分类 \""+a[i]+"\" 失败",style:'error',autoclose:3000,position:'top-right',icon:true,});success=false;},success:function(responseData){if(responseData["code"]!=0){spop({template:responseData["msg"],style:'error',autoclose:6000,position:'top-right',icon:true,});success=false;}}});}
if(success){spop({template:"保存成功",style:'success',autoclose:3000,position:'top-right',icon:true,});}
initClassificationMenu("classification/all");});$(".functionButtonRemove").click(function(){let input=$(this).parent().siblings().find("input");if(!input.hasClass("new")){let name=$.trim(input.val())
if(window.confirm("您确定要删除分类 \""+name+"\" 吗?")){$.ajax({type:"GET",async:false,url:"classification/remove/"+name,success:function(){spop({template:"分类 \""+name+"\" 已删除",style:'success',autoclose:3000,position:'top-right',icon:true,});}})
$(this).parent().parent().remove();initClassificationMenu("classification/all");}}});});}
function initAccountPopup(aid){template='\
    <h3>{{title}}</h3>\
    <ul>\
        <li>\
            <span class="prompt">账号</span><input type="text" value="{{name}}" class="a"> \
        </li>\
        <li>\
            <span class="prompt">密码</span><input type="text" value="{{password}}" class="p"> \
        </li>\
        <li>\
            <span>所属分类</span> <br>\
            <ul class="classification">\
                {{classification}} \
            </ul>\
        </li>\
        <li>\
            <strong>备注: </strong> <br>\
            <textarea name="" id="" cols="30" rows="10">{{remark}}</textarea> \
        </li>\
    </ul>\
    <div id="accounFunctionButton">\
        {{button}}\
    </div>\
    '
if(aid){let accountData=null;for(let i=0;i<accountList.length;i++){if(accountList[i]["aid"]==aid){accountData=accountList[i];break;}}
temporary=""
for(let i=0;i<classificationList.length;i++){let input='<li><input name="classification" value="{{name}}" type="checkbox" {{classification}}>{{name}}</li>';input=input.replace(/{{name}}/g,classificationList[i]);for(let j=0;j<accountData["classification"].length;j++){if(classificationList[i]==accountData["classification"][j]){input=input.replace("{{classification}}",'checked="checked"');}}
input=input.replace("{{classification}}","");temporary+=input;}
template=template.replace("{{title}}",accountData["name"]);template=template.replace("{{name}}",accountData["name"]);template=template.replace("{{password}}",accountData["password"]);template=template.replace("{{remark}}",accountData["remark"]);template=template.replace("{{classification}}",temporary);template=template.replace("{{button}}",'<button id="accountSave" type="button">保存修改</button><button id="accountRemove" type="button">删除账号</button>')}else{let temporary="";for(let i=0;i<classificationList.length;i++){let input='<li><input value="{{name}}" type="checkbox"> {{name}} </li>';input=input.replace(/{{name}}/g,classificationList[i]);temporary+=input;}
template=template.replace("{{title}}","新账户");template=template.replace(/{{name}}/g,"");template=template.replace("{{password}}","");template=template.replace("{{remark}}","");template=template.replace("{{classification}}",temporary);template=template.replace("{{button}}",'<button id="accountAdd" type="button">添加</button>');}
popup(template,[]);function getAccountData(){let popup=$("#popup");let name=$.trim(popup.find(".a").val());let password=$.trim(popup.find(".p").val());if(!name&&password){spop({template:"用户名和密码不能为空",style:'warning',autoclose:5000,position:'top-right',icon:true,});return false}
let remark=popup.find("textarea").val();let classification=[];let checkbox=popup.find("input:checkbox:checked");if(checkbox.length<=0){spop({template:"一个账号至少要有一个分类",style:'warning',autoclose:5000,position:'top-right',icon:true,});return false}
for(let i=0;i<checkbox.length;i++){classification.push($(checkbox[i]).val());}
return{"name":name,"password":password,"remark":remark,"classification":classification}}
$("#accountSave").click(function(){let accountData=getAccountData();if(!accountData){return false;}
requestData={"old":{"aid":aid},"new":accountData}
$.ajax({type:"POST",url:"/account/update",async:true,data:JSON.stringify(requestData),error:function(e){spop({template:"保存修改失败",style:'error',autoclose:3000,position:'top-right',icon:true,});},success:function(responseData){if(responseData["code"]==0){spop({template:"保存成功",style:'success',autoclose:3000,position:'top-right',icon:true,});initAccountTable("/account/get/所有账号");}else{spop({template:responseData["msg"],style:'error',autoclose:5000,position:'top-right',icon:true,});}}});});$("#accountRemove").click(function(){console.log(JSON.stringify({"aid":aid}));$.ajax({type:"POST",url:"/account/remove",contentType:"application/json; chaset=utf-8",dataType:"json",async:true,data:JSON.stringify({"aid":aid}),error:function(e){spop({template:"删除失败",style:'error',autoclose:3000,position:'top-right',icon:true,});},success:function(responseData){if(responseData["code"]==0){spop({template:"删除成功",style:'success',autoclose:3000,position:'top-right',icon:true,});initAccountTable("/account/get/所有账号");}else{spop({template:responseData["msg"],style:'error',autoclose:5000,position:'top-right',icon:true,});}}});});$("#accountAdd").click(function(){let requestData=getAccountData();if(!requestData){return false;}else{$.ajax({type:"POST",url:"/account/add",contentType:"application/json; chaset=utf-8",dataType:"json",async:true,data:JSON.stringify(requestData),error:function(e){spop({template:"添加失败",style:'error',autoclose:3000,position:'top-right',icon:true,});},success:function(responseData){if(responseData["code"]==0){spop({template:"添加成功成功",style:'success',autoclose:3000,position:'top-right',icon:true,});initAccountTable("/account/get/所有账号");}else{spop({template:responseData["msg"],style:'error',autoclose:5000,position:'top-right',icon:true,});}}});}});}