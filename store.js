// =======================
// APP STORE
// =======================

import {
  emit
}
from "./eventBus.js";

export const store={

  tasks:[],

  events:[],

  view:"week",

  currentDate:
    new Date(),

  loading:false

};

// =======================
// TASK
// =======================

export function setTasks(tasks){

  store.tasks=
    [...tasks];

  emit(
    "store:tasks",
    store.tasks
  );

}

export function addTask(task){

  store.tasks
    .push(task);

  emit(
    "store:tasks",
    store.tasks
  );

}

export function updateTask(
  id,
  data
){

  store.tasks=
    store.tasks
      .map(
        task=>

        task.id===id

        ?{
          ...task,
          ...data
        }

        :task
      );

  emit(
    "store:tasks",
    store.tasks
  );

}

export function removeTask(id){

  store.tasks=
    store.tasks
      .filter(
        task=>
        task.id!==id
      );

  emit(
    "store:tasks",
    store.tasks
  );

}

// =======================
// EVENTS
// =======================

export function setEvents(events){

  store.events=
    [...events];

  emit(
    "store:events",
    store.events
  );

}

export function addEvent(event){

  store.events
    .push(event);

  emit(
    "store:events",
    store.events
  );

}

export function removeEvent(id){

  store.events=
    store.events
      .filter(
        item=>
        item.id!==id
      );

  emit(
    "store:events",
    store.events
  );

}

// =======================
// VIEW
// =======================

export function setView(view){

  store.view=
    view;

  emit(
    "store:view",
    view
  );

}

export function setDate(date){

  store.currentDate=
    date;

  emit(
    "store:date",
    date
  );

}

// =======================
// LOADING
// =======================

export function setLoading(
  status
){

  store.loading=
    status;

  emit(
    "store:loading",
    status
  );

}

// =======================
// RESET
// =======================

export function resetStore(){

  store.tasks=[];

  store.events=[];

  store.view="week";

  store.currentDate=
    new Date();

  emit(
    "store:reset"
  );

}
