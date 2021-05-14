const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const day_secs = 86400000;
var week = [
    {id:0, day:getNextDay(0), isToday:true},
    {id:1, day:getNextDay(1)},
    {id:2, day:getNextDay(2)},
    {id:3, day:getNextDay(3)},
    {id:4, day:getNextDay(4)},
    {id:5, day:getNextDay(5)},
    {id:6, day:getNextDay(6)}
];
var prev_y = 0;
var id = 0;
var tasks = [];
var task_ids = [];
var checkedBoxes = 0;

window.onload = () => {
    console.log("Loadin forever more fun ^^");
    
    loadContainers();
    
    for (day of week) {
        $('#day_' + (day.id + 1) + '_title').text(day.day);
        if (day.isToday) 
        $('#day_' + (day.id + 1) + '_title').after('<span>(Today)</span>')
    }

    $('#day_1_tasks, #day_2_tasks, #day_3_tasks, #day_4_tasks, #day_5_tasks, #day_6_tasks, #day_7_tasks').sortable({
        connectWith: '.task_container',
        tolerance: 'pointer',
        items: 'li',
        axis: 'y',
        handle: '.task_handl',
        stop: (evt, ui) => {
            ui.item.removeAttr('style');
            let id = ui.item.attr('id');
            let day = parseInt(ui.item.parent().parent().attr('id').replace('day_', ''));
            let task = tasks[task_ids.indexOf(id)];
            task.updateDay(day);
            console.log()
        }
    })
    idbKeyval.get('id').then((val) => val === undefined ? id = 0 : id = val); //async
    loadTasks();
}

function getNextDay(add) {
    let today = new Date();
    return weekdays[new Date(today.getTime() + (add * day_secs)).getDay()]; 
}

function addTask() {
    let task = new Task(id++, new Date().getDay(), 'Hi', false);
    let day_container = $('#day_1_tasks').append(task.getHtml());
    addInputEvent(task, day_container);
    idbKeyval.update('id', (val) => (val || 0) + 1);
}

function loadContainers() {
    for (day of week) {  
        $('#todo_container').append('<div id="day_' + (day.id + 1) + '" class="day_container"></div>');
        $('#day_' + (day.id + 1)).append('<h2 id="day_' + (day.id + 1) + '_title" class="task_title"></h2>');
        $('#day_' + (day.id + 1)).append('<ul id="day_' + (day.id + 1) + '_tasks" class="task_container"></ul>');
    }
}

function loadTasks() {
    idbKeyval.get('tasks').then((val) => {
        if (val === undefined) return;
        for (i of val) {// TODO save and load tasks in the correct order (as sorted - rn it's based on the id)
            idbKeyval.get(i).then((ival) => {
                if (ival === undefined) return;
                let obj = JSON.parse(ival);
                let task = new Task(obj.id, obj.day, obj.content, obj.checked);
                day_container = $('#day_' + task.day + '_tasks').append(task.getHtml())
                if (task.checked) checkedBoxes++;
                addInputEvent(task, day_container);
            })
        }
        
        
    })
}

function addInputEvent(task, day_container) {
    let task_el = $(day_container).find('#task_' + task.id);
    let task_el_cont = $(task_el).find('.task_content');
    task_el_cont.get(0).addEventListener('input', function(evt) {
        if (evt.inputType == 'insertParagraph') {
            task_el_cont.find('div').last().remove();
            task_el_cont.blur();
        }
        task.updateContent(evt.target.innerHTML)
    })
    //Checkbox:
    task_el.find('input').on('click', () => {
        task.updateChecked();
        (task.checked) ? checkedBoxes++ : checkedBoxes--;
        toggleDelete(false);
    })
    task_el.find('input').prop('checked', task.checked);
    toggleDelete(true);
}

function clearCompleted() {
    $('input.complete_box').each(function(evt) {
        if ($(this).is(':checked')) {
            $(this).parent().fadeOut(() => {this.remove()});
            let id = $(this).parent().attr('id');
            let pos = task_ids.indexOf(id);
            tasks.splice(pos, 1);
            task_ids.splice(pos, 1);
            (tasks.length === 0) ? idbKeyval.del('tasks') : idbKeyval.set('tasks', task_ids);
            idbKeyval.del(id)
            //hide delete button:
            checkedBoxes--;
            toggleDelete(false);
        }
    })
}

function toggleDelete(instant) {
    if (instant) {
        (checkedBoxes > 0) ? $('#clearcompleted').show() : $('#clearcompleted').hide();
    } else {
        (checkedBoxes > 0) ? $('#clearcompleted').fadeIn() : $('#clearcompleted').fadeOut();
    }
}

function toMainMenu() {
    console.log("Returning to menu!");
}

function Task(n_id, day, content, checked) {
    this.id = n_id;
    this.task_id = 'task_' + this.id;
    this.day = day; // TODO Currently day represents the day of the week, but 
                    //the task gets added to the day based on the id of the day_container - requires fixing!
    this.content = content;
    this.checked = checked;
    this.getHtml = function() {
        return '<li class="task" id="task_' + this.id + '"><span class="task_handl">⠿</span><input type="checkbox" class="complete_box">'
        + '<div class="task_content"contenteditable="true">' + this.content + '</div></li>';
    }
    this.updateContent = function(content) {
        this.content = content;
        idbKeyval.set(this.task_id, JSON.stringify(this))
    }
    this.updateDay = function(day) {
        this.day = day;
        idbKeyval.set(this.task_id, JSON.stringify(this))
    }
    this.updateChecked = function() {
        this.checked = !this.checked;
        idbKeyval.set(this.task_id, JSON.stringify(this))
    }
    task_ids.push(this.task_id);
    tasks.push(this);

    
    idbKeyval.set('tasks', task_ids);
    idbKeyval.set(this.task_id, JSON.stringify(this));
}


//HELPER classes:

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        var k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    return arr; // for testing
};