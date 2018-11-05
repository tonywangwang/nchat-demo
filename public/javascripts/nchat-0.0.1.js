var chat, socket;
var nchat = function (container, server) {
    chat = chatUI(d3.select(container));
    socket = io.connect(server);

    var conversation = {};

    conversation.init = function () {
        chat.addBubble({ type: 'text', value: '欢迎进入 N-Chat', class: 'bot', delay: 1000 }, function () {
            chat.addBubble({ type: 'text', value: '你可以在这里寻求帮准，或者帮助别人', class: 'bot', delay: 500 }, function () {
                chat.addBubble({ type: 'text', value: '好，我们开始吧 :)', class: 'bot', delay: 0 });
            });


        });

        chat.showInput(conversation.send);
    };



    conversation.send = function (msg) {
        if (!msg) return;
        conversation.myLastMsg = msg;
        socket.emit('message', msg);
        chat.addBubble({ type: 'text', value: msg, class: 'human', delay: 0 });
    };

    socket.on('message', function (msg) {
        if (msg == conversation.myLastMsg) return;
        chat.addBubble({ type: 'text', value: msg, class: 'bot', delay: 0 });
    });


    socket.on('join', function (n) {
        chat.addBubble({ type: 'text', value: '一位 Newegger 冲了进来，当前总计有 ' + n + ' 位 Newgger 在线', class: 'bot', delay: 0 });
    });

    socket.on('left', function (n) {
        chat.addBubble({ type: 'text', value: '一位 Newegger 转身离开，当前总计有 ' + n + ' 位 Newgger 在线', class: 'bot', delay: 0 });
    });


    conversation.init();

};
