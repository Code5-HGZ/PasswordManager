// 记录分类信息
var CLASSIFICATION_DATA = null;

// 记录账号信息
var ACCOUNT_DATA = null;

// 记录当前所在分类
var CURRENT_CLASSIFICATION = null;


/**
 * 弹窗
 * @param {*} content -- 显示到弹窗的内容, 可以是文本或者HTML 
 * @param {*} closeButton -- 是否显示关闭按钮, 默认为 true, 显示关闭按钮
 * @param {*} duration -- 弹窗弹出动画所用时间, 单位为毫秒
 */
function popup(content, closeButton = true, duration = 500) {
    let popupOcclude = $('<div id="popupOcclude"></div>');
    let popupBox = $('<div id="popupBox"></div>');
    let temporary = '<div id="popup" class="animated bounceInDown" style="animation-duration:{{duration}}ms">{{content}}</div>'.replace("{{content}}", content);
    let popup = $(temporary.replace("{{duration}}", duration));

    // 弹窗是否有关闭按钮
    if (closeButton) {
        let popupClose = $('\
            <div id="popupClose">\
                <svg t="1583482970163" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8288" width="20" height="20"> \
                    <path d="M512 0C228.43 0 0 228.43 0 512s228.43 512 512 512 512-228.43 512-512S795.57 0 512 0z m208.738 673.477c11.816 11.815 11.816 31.508 0 39.385-11.815 11.815-31.507 11.815-39.384 0L519.877 551.385 358.4 712.862c-11.815 11.815-31.508 11.815-39.385 0-11.815-11.816-11.815-31.508 0-39.385L480.492 512 319.015 350.523c-7.877-11.815-7.877-27.57 0-39.385 11.816-11.815 31.508-11.815 39.385 0l161.477 161.477 161.477-161.477c11.815-11.815 31.508-11.815 39.384 0 11.816 11.816 11.816 31.508 0 39.385L559.262 512l161.476 161.477z" p-id="8289" fill="#a85d52"></path> \
                </svg> \
            </div> \
        ');
        popup.append(popupClose);

        // 为关闭按钮绑定点击事件, 用于清理(关闭)弹窗
        popupClose.click(function () {
            popupOcclude.remove();
        });
    }

    popupBox.append(popup);
    popupOcclude.append(popupBox);
    $("body").append(popupOcclude);

    // 返回一个窗口对象, 在不显示关闭按钮的情况下可使用该对象的popupClose()关闭窗口
    return {
        popupClose: function () {
            popupOcclude.remove();
        }
    };
}


/**
 * 根据本地分类数据渲染分类列表
 */
function renderClassificationList() {
    let classificationList = $("#classification-list");
    let liTemplate = '\
        <li>\
            <svg t="1583855437431" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5629" width="20" height="20"><path d="M754.567168 482.523136c12.566528-12.609536 18.255872-30.396416 15.652864-49.317888l-0.159744-1.14688-54.9888-227.295232c-1.49504-9.515008-5.005312-18.448384-10.016768-26.411008l30.291968-36.098048c8.169472-9.734144 6.899712-24.250368-2.83648-32.41984-9.73824-8.169472-24.252416-6.899712-32.421888 2.83648l-30.212096 36.005888c-8.818688-3.647488-18.364416-5.599232-28.133376-5.412864l-231.553024-14.024704-1.130496-0.069632-1.128448 0.043008c-19.085312 0.720896-35.616768 9.41056-45.848576 23.973888a62.038016 62.038016 0 0 0-3.39968 3.725312L117.274624 444.61056c-24.7296 29.474816-17.92 76.050432 15.181824 103.825408l272.7424 228.864c33.101824 27.774976 80.152576 26.392576 104.882176-3.084288l241.410048-287.700992a60.915712 60.915712 0 0 0 3.076096-3.991552z m-33.015808-32.098304l-2.349056 2.103296-1.69984 2.658304c-0.411648 0.64512-0.83968 1.232896-1.26976 1.742848L474.824704 744.63232c-8.27392 9.86112-26.61376 8.675328-40.040448-2.592768L162.03776 513.179648c-13.428736-11.270144-17.778688-29.120512-9.504768-38.985728L393.940992 186.494976c0.43008-0.512 0.935936-1.032192 1.492992-1.548288l2.326528-2.134016 1.662976-2.684928c1.81248-2.924544 4.864-4.521984 9.302016-4.868096l227.293184 13.766656-33.570816 40.00768c-30.988288-11.436032-67.198976-2.973696-89.622528 23.74656-28.534784 34.004992-24.08448 84.8896 9.92256 113.424384 34.00704 28.536832 84.8896 24.08448 113.426432-9.924608 24.35072-29.018112 24.659968-70.313984 3.104768-99.538944l31.830016-37.937152 53.622784 221.640704c0.425984 4.417536-0.618496 7.69024-3.180544 9.979904z m-120.633344-123.72992c-12.222464 14.567424-34.015232 16.47616-48.582656 4.251648-14.563328-12.222464-16.474112-34.015232-4.2496-48.582656 12.222464-14.565376 34.01728-16.472064 48.582656-4.247552 14.565376 12.218368 16.472064 34.013184 4.2496 48.57856z" p-id="5630" fill="#62a259"></path><path d="M916.15232 526.987264l-46.966784-270.542848c-2.174976-12.52352-14.088192-20.912128-26.607616-18.737152-12.52352 2.174976-20.912128 14.086144-18.735104 26.609664l43.859968 252.645376a16.072704 16.072704 0 0 1-3.524608 13.08672l-292.712448 348.83584c-8.2944 9.883648-7.192576 24.997888 2.84672 33.103872 9.730048 7.85408 24.008704 6.5024 32.077824-3.119104l304.717824-363.147264a23.027712 23.027712 0 0 0 5.044224-18.735104z" p-id="5631" fill="#62a259"></path></svg>\
            <span>{{classificationName}}</span>\
        </li>\
    ';
    let liList = ""
    for (let i = 0; i < CLASSIFICATION_DATA.length; i++) {
        liList += liTemplate.replace("{{classificationName}}", CLASSIFICATION_DATA[i]);
    }
    classificationList.empty();
    classificationList.append(liList);

    // 为所有分类菜单项绑定点击事件处理函数
    classificationList.children().click(function () {
        let me = $(this);
        let siblings = me.siblings();
        for (let i = 0; i < siblings.length; i++) {
            $(siblings[i]).children("svg").css("opacity", "0");
        }
        me.children("svg").css("opacity", "1");

        CURRENT_CLASSIFICATION = $.trim(me.text());
        renderAccountTable(getTheCurrentClassifiedAccountData());
    });
}



/**
 * 初始化分类菜单
 */
function initClassificationList() {
    apiUrl = "/classification/all"
    $.ajax({
        type: "GET",
        url: apiUrl,
        async: false,
        success: function (responseData) {
            if (responseData["code"] == 0) {
                CLASSIFICATION_DATA = responseData["result"];
                CURRENT_CLASSIFICATION = responseData["result"][0];
            } else {
                spop({
                    template: responseData["msg"],
                    style: 'error',
                    autoclose: 5000,
                    position: 'top-right',
                    icon: true,
                });
                return false;
            }
            // 重新渲染分类列表
            renderClassificationList();
        },
    });
}



/**
 * 根据本地账户数据渲染账户表格
 */
function renderAccountTable(data) {
    let trTemplate = '\
        <tr style="animation-delay:{{delay}}ms;-webkit-animation-delay:{{delay}};animation-duration:500ms;" class="{{background}} animated slideInRight" id="aid{{aid}}" onclick="accountPopup(\'{{aid}}\')">   \
             <td>{{name}}</td>\
             <td>{{createDate}}</td>\
             <td>{{updateDate}}</td>\
        </tr>  \
    ';
    let thTemplate = '\
        <tr>  \
             <th>账户名称</th>\
             <th>创建时间</th>\
             <th>最后修改时间</th>\
        </tr>  \
    '
    let template = "";
    let counter = 0;
    let delay = 0;
    template += thTemplate;
    for (let i = 0; i < data.length; i++) {
        let tr = trTemplate.replace(/{{aid}}/g, data[i]["aid"]);
        tr = tr.replace("{{name}}", data[i]["name"]);
        tr = tr.replace("{{createDate}}", data[i]["createDate"]);
        tr = tr.replace("{{updateDate}}", data[i]["updateDate"]);
        tr = tr.replace(/{{delay}}/g, delay);
        delay += 20;
        if (counter == 0) {
            tr = tr.replace("{{background}}", "table-bright");
            counter = 1;
        } else {
            tr = tr.replace("{{background}}", "table-dark");
            counter = 0;
        }
        template += tr;
    }
    let accountTable = $("#account-table table");
    accountTable.empty();
    accountTable.append(template);
}


/**
 * 初始化账户表格
 */
function initAccountTable() {
    apiUrl = "account/get/all";
    let p = null
    $.ajax({
        url: apiUrl,
        async: true,
        beforeSend: function () {
            p = globalLoadingSvg("账号数据加载中...");
        },
        success: function (responseData) {
            if (responseData["code"] == 0) {
                ACCOUNT_DATA = responseData["result"];
                renderAccountTable(ACCOUNT_DATA);
            } else {
                spop({
                    template: responseData["msg"],
                    style: 'error',
                    autoclose: 5000,
                    position: 'top-right',
                    icon: true,
                });
            }
        },
        complete: function () {
            p.popupClose();
        }
    });
}


// 获取账户弹窗数据
function getAccountData() {
    let popup = $("#popup");
    let name = $.trim(popup.find(".a").val());
    let password = $.trim(popup.find(".p").val());
    // 检查用户名和密码
    if (!(name && password)) {
        spop({
            template: "账户名和密码不能为空",
            style: 'warning',
            autoclose: 4000,
            position: 'top-right',
            icon: true,
        });
        return false
    }
    let remark = popup.find("textarea").val();
    let classification = [];
    let checkbox = popup.find("input:checkbox:checked");
    // 检查分类
    if (checkbox.length <= 0) {
        spop({
            template: "一个账号至少属于一个分类",
            style: 'warning',
            autoclose: 5000,
            position: 'top-right',
            icon: true,
        });
        return false
    }
    for (let i = 0; i < checkbox.length; i++) {
        classification.push($(checkbox[i]).val());
    }

    function dateFormat(fmt, date) {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }

    let datetime = dateFormat("YYYY-mm-dd HH:MM:SS", new Date());
    return {
        "name": name,
        "password": password,
        "remark": remark,
        "classification": classification,
        "createDate": datetime,
        "updateDate": datetime
    }
}


// 获取当前分类对应的数据
function getTheCurrentClassifiedAccountData() {
    let data = []
    for (let i = 0; i < ACCOUNT_DATA.length; i++) {
        if (ACCOUNT_DATA[i]["classification"].indexOf(CURRENT_CLASSIFICATION) != -1) {
            data.push(ACCOUNT_DATA[i]);
        }
    }
    return data;
}


/**
 * 账号弹窗
 * @param {*} aid -- 账号aid 
 */
function accountPopup(aid) {
    template = '\
        <h3>{{title}}</h3>\
        <ul>\
            <li><span class="prompt">账号</span><input type="text" value="{{name}}" class="a"></li>\
            <li><span class="prompt">密码</span><input type="text" value="{{password}}" class="p"></li>\
            <li><span>所属分类</span> <br>\
                <ul class="classification">\
                    {{classification}} \
                </ul>\
            </li>\
            <li><strong>备注: </strong> <br> <textarea name="" id="" cols="30" rows="10">{{remark}}</textarea></li>\
        </ul>\
        <div id="accounFunctionButton">\
            {{button}}\
        </div>\
    ';
    let data = {}

    // 当aid有效时候根据账户aid弹出带有账户数据的弹窗
    if (aid) {
        // 获取对应aid对的账户数据
        for (let i = 0; i < ACCOUNT_DATA.length; i++) {
            if (ACCOUNT_DATA[i]["aid"] == aid) {
                data = ACCOUNT_DATA[i];
                break;
            }
        }
        // 预选定分类
        let input = "";
        for (let i = 0; i < CLASSIFICATION_DATA.length; i++) {
            let inputTemplate = '<li><input name="classification" value="{{name}}" type="checkbox">{{name}}</li>'
            for (let j = 0; j < data["classification"].length; j++) {
                if (data["classification"][j] == CLASSIFICATION_DATA[i]) {
                    inputTemplate = '<li><input name="classification" value="{{name}}" type="checkbox" checked="checked">{{name}}</li>'
                    break;
                }
            }
            inputTemplate = inputTemplate.replace(/{{name}}/g, CLASSIFICATION_DATA[i]);
            input += inputTemplate;
        }
        // 生成弹窗HTML内容
        template = template.replace("{{classification}}", input);
        template = template.replace("{{title}}", "账号详情");
        template = template.replace("{{name}}", data["name"]);
        template = template.replace("{{password}}", data["password"]);
        template = template.replace("{{remark}}", data["remark"]);
        template = template.replace("{{button}}", '<button type="button" id="function-button-account-save">保存</button><button type="button" id="function-button-account-remove">删除</button>');
    } else {
        let input = "";
        for (let i = 0; i < CLASSIFICATION_DATA.length; i++) {
            input += '<li><input name="classification" value="{{name}}" type="checkbox">{{name}}</li>'.replace(/{{name}}/g, CLASSIFICATION_DATA[i])
        }
        template = template.replace("{{title}}", "添加新账号");
        template = template.replace(/{{name}}/g, "");
        template = template.replace("{{password}}", "");
        template = template.replace("{{classification}}", input);
        template = template.replace("{{remark}}", "");
        template = template.replace("{{button}}", '<button type="button" id="function-button-account-add">添加</button>');
    }

    let p = popup(template, true, 300);

    // 为弹窗按钮点击事件绑定处理函数
    let functionButtonAccountSave = $("#function-button-account-save");
    let functionButtonAccountRemove = $("#function-button-account-remove");
    let functionButtonAccountAdd = $("#function-button-account-add");

    if (functionButtonAccountRemove.length > 0) {
        apiUrl = "account/remove";
        functionButtonAccountRemove.click(function () {
            let me = $(this);
            let oldText = "";
            for (let i = 0; i < ACCOUNT_DATA.length; i++) {
                if (aid == ACCOUNT_DATA[i]["aid"]) {
                    $.ajax({
                        url: apiUrl,
                        type: "POST",
                        data: JSON.stringify({ "aid": aid }),
                        beforeSend: function () {
                            oldText = me.text();
                            me.text("");
                            me.attr("class", "svg-loading-loading");
                        },
                        success: function (responseData) {
                            if (responseData["code"] == 0) {
                                // 移除本地账户记录
                                let index = ACCOUNT_DATA.indexOf(ACCOUNT_DATA[i]);
                                ACCOUNT_DATA.splice(index, 1);
                                // 关闭账号弹窗
                                p.popupClose();
                                // 刷新本地账户表格
                                renderAccountTable(getTheCurrentClassifiedAccountData());
                                spop({
                                    template: "删除成功",
                                    style: 'success',
                                    autoclose: 3000,
                                    position: 'top-right',
                                    icon: true,
                                });
                            } else {
                                spop({
                                    template: '<h3>删除失败<h3>' + responseData["msg"],
                                    style: 'error',
                                    autoclose: 3000,
                                    position: 'top-right',
                                    icon: true,
                                });
                            }
                        },
                        complete: function () {
                            me.attr("class", "");
                            me.text(oldText);
                        }
                    });
                    break;
                }
            }
        });
    }

    if (functionButtonAccountAdd.length > 0) {
        functionButtonAccountAdd.click(function () {
            let apiUrl = "/account/add"
            let accountData = getAccountData();
            let me = $(this);
            let oldText = "";
            if (accountData) {
                $.ajax({
                    url: apiUrl,
                    type: "POST",
                    data: JSON.stringify(accountData),
                    beforeSend: function () {
                        oldText = me.text();
                        me.text("");
                        me.attr("class", "svg-loading-loading");
                    },
                    success: function (responseData) {
                        if (responseData["code"] == 0) {
                            accountData["aid"] = responseData["aid"];
                            ACCOUNT_DATA.push(accountData);
                            spop({
                                template: '添加成功',
                                style: 'success',
                                autoclose: 3000,
                                position: 'top-right',
                                icon: true,
                            });
                            renderAccountTable(getTheCurrentClassifiedAccountData());
                        } else {
                            spop({
                                template: '添加失败: ' + responseData["msg"],
                                style: 'error',
                                autoclose: 3000,
                                position: 'top-right',
                                icon: true,
                            });
                        }
                    },
                    complete: function () {
                        me.attr("class", "");
                        me.text(oldText);
                    }
                });
            }
        });
    }

    if (functionButtonAccountSave.length > 0) {
        let apiUrl = "account/update";
        functionButtonAccountSave.click(function () {
            let accountData = getAccountData();
            let requestData = {
                "old": {
                    "aid": aid
                },
                "new": accountData
            }
            let oldText = "";
            let me = $(this);
            if (accountData) {
                $.ajax({
                    url: apiUrl,
                    type: "POST",
                    data: JSON.stringify(requestData),
                    beforeSend: function () {
                        oldText = me.text();
                        me.text("");
                        me.attr("class", "svg-loading-loading");
                    },
                    success: function (responseData) {
                        if (responseData["code"] == 0) {
                            for (let i = 0; i < ACCOUNT_DATA.length; i++) {
                                if (aid == ACCOUNT_DATA[i]["aid"]) {
                                    let index = ACCOUNT_DATA.indexOf(ACCOUNT_DATA[i]);
                                    console.log(index);
                                    console.log(ACCOUNT_DATA[index]);
                                    accountData["aid"] = Number(aid);
                                    ACCOUNT_DATA[index] = accountData;
                                    console.log(ACCOUNT_DATA[index]);
                                }
                            }
                            spop({
                                template: '账户数据已更新',
                                style: 'success',
                                autoclose: 3000,
                                position: 'top-right',
                                icon: true,
                            });
                        } else {
                            spop({
                                template: '保存失败: ' + responseData["msg"],
                                style: 'error',
                                autoclose: 3000,
                                position: 'top-right',
                                icon: true,
                            });
                        }
                    },
                    complete: function () {
                        me.attr("class", "");
                        me.text(oldText);
                    }
                });
            }
        });
    }
}


/**
 * 分类管理弹窗
 */
function classificationPopup(e) {
    let template = ' \
        <div id="classification-popup">  \
            <h3>分类管理</h3> \
            <hr> \
            <table>   \
                {{items}} \
            </table>  \
            <div id="functionButton"> \
                <button type="button" id="function-button-add-classification">添加分类</button> \
                <button type="button" id="function-button-save-classification">保存修改</button> \
            </div> \
        </div> \
    ';
    let items = ""
    let temporary = ""
    for (let i = 0; i < CLASSIFICATION_DATA.length; i++) {
        temporary = ' \
                <tr> \
                    <td><input value="{{classificationName}}"></td>\
                    <td> \
                        <button type="button" class="function-button-remove-classification">删除</button> \
                    </td>\
                </tr> \
            ';
        temporary = temporary.replace("{{classificationName}}", CLASSIFICATION_DATA[i]);
        items += temporary;
    }
    template = template.replace("{{items}}", items);
    popup(template, ["animation-duration: 500ms"]);

    $("#function-button-add-classification").click(function () {
        let template = ' \
            <tr> \
                <td><input class="new" placeholder="请输入新的分类的名称"></td>\
                <td> \
                    <button type="button" class="function-button-remove-classification" id="{{randomId}}">删除</button> \
                </td>\
            </tr> \
        ';
        let randomId = (new Date()).valueOf();
        template = template.replace("{{randomId}}", randomId);
        $("#classification-popup table").append(template);
        $("#" + randomId).click(function () {
            $(this).parent().parent().remove();
        });
    });

    $("#function-button-save-classification").click(function () {
        let apiUrlAdd = "classification/add/";
        let apiUrlUpdate = "classification/update/";
        let success = true;
        let inputList = $("#classification-popup table").find("input");
        // 分类名称旧值
        let o = [];
        // 分类名称新值, 如果没有修改, 则值和o一致
        let n = [];
        // 需要新添加的分类的名称
        let a = [];

        /* 获取分类管理器中的input值并分类 */
        for (let i = 0; i < inputList.length; i++) {
            let input = $(inputList[i]);
            // 使用分类管理器添加的分类会添加一个 .new, 
            // 根据.new 判断是否是新创建分类
            if (input.hasClass("new")) {
                a.push($.trim(input.val()));
            } else {
                o.push($.trim(input.attr("value")));
                n.push($.trim(input.val()));
            }
        }

        /* 修改本地分类数据 */
        CLASSIFICATION_DATA = n;
        // 添加新分类名称到本地分类数组
        for (let i = 0; i < a.length; i++) {
            CLASSIFICATION_DATA.push(a[i]);
        }

        let oldText = "";
        let me = $(this);
        oldText = me.text();
        me.text("");
        me.attr("class", "svg-loading-loading");
        /* 向后端更新已经修改的分类名称 */
        for (let i = 0; i < o.length; i++) {
            if (o[i] != n[i]) {
                $.ajax({
                    type: "GET",
                    async: false,
                    url: apiUrlUpdate + o[i] + "/" + n[i],
                    error: function (e) {
                        spop({
                            template: "更新分类 \"" + o[i] + "\" 失败",
                            style: 'error',
                            autoclose: 3000,
                            position: 'top-right',
                            icon: true,
                        });
                        success = false;
                        return;
                    },
                    success: function (responseData) {
                        if (responseData["code"] != 0) {
                            spop({
                                template: responseData["msg"],
                                style: 'error',
                                autoclose: 3000,
                                position: 'top-right',
                                icon: true,
                            });
                            success = false;
                        }
                        return;
                    }
                });
            }
        }
        // 向后端添加新创建的分类
        for (let i = 0; i < a.length; i++) {
            $.ajax({
                type: "GET",
                async: false,
                url: apiUrlAdd + a[i],
                error: function (e) {
                    spop({
                        template: "添加分类 \"" + a[i] + "\" 失败",
                        style: 'error',
                        autoclose: 3000,
                        position: 'top-right',
                        icon: true,
                    });
                    success = false;
                    return;
                },
                success: function (responseData) {
                    if (responseData["code"] != 0) {
                        spop({
                            template: responseData["msg"],
                            style: 'error',
                            autoclose: 6000,
                            position: 'top-right',
                            icon: true,
                        });
                        success = false;
                        return;
                    }
                }
            });
        }
        me.attr("class", "");
        me.text(oldText);

        if (success) {
            spop({
                template: "保存成功",
                style: 'success',
                autoclose: 3000,
                position: 'top-right',
                icon: true,
            });
        }


        // 刷新分类菜单
        // initClassificationList();
        // 重新渲染分类列表
        renderClassificationList();
    });

    $(".function-button-remove-classification").click(function () {
        let me = $(this);
        let input = $(this).parent().siblings().find("input");
        if (!input.hasClass("new")) {
            let name = $.trim(input.val())
            if (window.confirm("您确定要删除分类 \"" + name + "\" 吗?")) {
                $.ajax({
                    type: "GET",
                    url: "classification/remove/" + name,
                    beforeSend: function () {
                        me.text("");
                        // me[0].classList.add("svg-loading-loading");
                        me.addClass("svg-loading-loading");
                    },
                    success: function () {
                        me.parent().parent().remove();
                        index = CLASSIFICATION_DATA.indexOf(name);
                        CLASSIFICATION_DATA.splice(index, 1)
                        renderClassificationList();
                    },
                })
            }
        }
    });
}



/**
 * 全局加载中SVG动画
 * @param {*} msg -- 动画显示时显示的消息
 */
function globalLoadingSvg(msg, ) {
    let loadingSvg = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; background: none; display: block; shape-rendering: auto;" width="100px" height="100px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"> \
    <g>\
      <circle cx="85.3342" cy="50" r="4" fill="#e15b64">\
        <animate attributeName="cx" repeatCount="indefinite" dur="1s" values="95;35" keyTimes="0;1" begin="-0.67s"></animate>\
        <animate attributeName="fill-opacity" repeatCount="indefinite" dur="1s" values="0;1;1" keyTimes="0;0.2;1" begin="-0.67s"></animate>\
      </circle>\
      <circle cx="45.7342" cy="50" r="4" fill="#e15b64">\
        <animate attributeName="cx" repeatCount="indefinite" dur="1s" values="95;35" keyTimes="0;1" begin="-0.33s"></animate>\
        <animate attributeName="fill-opacity" repeatCount="indefinite" dur="1s" values="0;1;1" keyTimes="0;0.2;1" begin="-0.33s"></animate>\
      </circle>\
      <circle cx="65.5342" cy="50" r="4" fill="#e15b64">\
        <animate attributeName="cx" repeatCount="indefinite" dur="1s" values="95;35" keyTimes="0;1" begin="0s"></animate>\
        <animate attributeName="fill-opacity" repeatCount="indefinite" dur="1s" values="0;1;1" keyTimes="0;0.2;1" begin="0s"></animate>\
      </circle>\
    </g>\
    <g transform="translate(-15 0)">\
      <path d="M50 50L20 50A30 30 0 0 0 80 50Z" fill="#f8b26a" transform="rotate(90 50 50)"></path>\
      <path d="M50 50L20 50A30 30 0 0 0 80 50Z" fill="#f8b26a" transform="rotate(44.1986 50 50)">\
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;45 50 50;0 50 50" keyTimes="0;0.5;1"></animateTransform>\
      </path>\
      <path d="M50 50L20 50A30 30 0 0 1 80 50Z" fill="#f8b26a" transform="rotate(-44.1986 50 50)">\
        <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;-45 50 50;0 50 50" keyTimes="0;0.5;1"></animateTransform>\
      </path>\
    </g>\
    </svg>\
    <p style="text-align: center; color: #474747;">{{msg}}</p>\
    ';
    loadingSvg = loadingSvg.replace("{{msg}}", msg);
    let p = popup(loadingSvg, false, 10);
    return p;
}


/**
 * 搜索账号数据
 * @param {*} e 
 */
function searchAccount(e) {
    let input = $(e).siblings("input");
    let searchIndex = $.trim(input.val());
    let reg = new RegExp(searchIndex, "i");
    let data = [];
    if (searchIndex == "") {
        spop({
            template: "您必须输入才可以搜索",
            style: "warning",
            autoclose: 3000,
            position: 'top-right',
            icon: true,
        });
        return false;
    };
    for (let i = 0; i < ACCOUNT_DATA.length; i++) {
        if ((ACCOUNT_DATA[i]["name"].match(reg)) || (ACCOUNT_DATA[i]["remark"].match(reg))) {
            data.push(ACCOUNT_DATA[i]);
        }
    }

    renderAccountTable(data);
}
// 如果用户再输入过程中回车则模拟搜索按钮点击事件进行搜索, 达到不用点击搜索按钮直接回车搜索效果
console.log( $("#search") );
// $("#search input").bind("keyup", function(event) {
//     　　if (event.keyCode == "13") {
//     　　　　//回车执行查询
//     　　　　$("#search button").click();
//     　　}
//     console.log(event.keyCode);
//     });


$(document).ready(function () {
    initClassificationList();
    initAccountTable();
    $("#function-box-new-account").click(function () {
        accountPopup(false);
    });
    // 搜索输入框输入回车时模拟点击搜索按钮实现回车搜索功能
    $("#search input").bind("keyup", function(event) {
    　　if (event.keyCode == "13") {
    　　　　//回车执行查询
    　　　　$("#search button").click();
    　　}
    });
});