~toOSC = NetAddr.new("127.0.0.1", 57121);    // create the NetAddr
~toOSC.sendMsg("/eval", "tl()");    // send the application the message "hello" with the parameter "there"

(
~js = {
    | s |
    ~toOSC.sendMsg("/eval", s);
}
)

(
~tab = {
    | s |
    ~toOSC.sendMsg("/eval", "tab('" ++ s ++ "');");
}
)

(
~tb = {
    | s |
    ~toOSC.sendMsg("/eval", "tb('" ++ s ++ "');");
}
)

~js.("tl()")




(
~listen.free;
~listen = OSCdef(\listener, {|msg|
    ~js.("buzz = " + (1 /(msg[3] * 10)));
}, '/dListener');
)

(
~listenY.free;
~listenY = OSCdef(\listener2, {|msg|
    ~js.("buzzY = " + ((msg[3] * 2000)));
}, '/dYListener');
)

~listen.free;

"buzz = " + (data[0] * 1e5 - 0.5e5)


