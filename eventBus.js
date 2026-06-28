// =======================
// EVENT BUS
// =======================

const listeners = {};

// Đăng ký lắng nghe
export function on(event, callback){

  if(!listeners[event]){

    listeners[event]=[];

  }

  listeners[event].push(callback);

}

// Lắng nghe 1 lần
export function once(event, callback){

  const wrapper=(data)=>{

    callback(data);

    off(
      event,
      wrapper
    );

  };

  on(
    event,
    wrapper
  );

}

// Hủy lắng nghe
export function off(event, callback){

  if(!listeners[event])
    return;

  listeners[event]=
    listeners[event]
      .filter(
        fn=>fn!==callback
      );

}

// Phát sự kiện
export function emit(event, data){

  if(!listeners[event])
    return;

  listeners[event]
    .forEach(fn=>{

      try{

        fn(data);

      }catch(err){

        console.error(
          `[EVENT ERROR] ${event}`,
          err
        );

      }

    });

}

// Xóa toàn bộ listener
export function clear(event){

  if(event){

    delete listeners[event];

  }else{

    Object
      .keys(listeners)
      .forEach(
        key=>
        delete listeners[key]
      );

  }

}

// Debug
export function getListeners(){

  return listeners;

}
