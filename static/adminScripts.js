let fileBackup = {};

function loadList(id) {
    let listDiv = document.getElementById('pages');
    $.ajax({
        url: location.toString() + 'list',
        data: {
            paginateBy: localStorage.getItem('paginateBy'),
            page: id
        },
        dataType: 'html',
        success: (response) => {
            listDiv.innerHTML = response;
        }
    });
}

function changePage() {
    loadList(this.value);
}

function changePaginationCount() {
    localStorage.setItem('paginateBy', document.getElementById('paginateBy').value);
    loadList(1);
}

function setupPaginateBy() {
    let s = document.getElementById('paginateBy');
    let p = localStorage.getItem('paginateBy');
    if (!p) {
        s.value = 50;
        localStorage.setItem('paginateBy', 50)
    } else {
        s.value = p;
    }
}

function selectAll(p) {
    let checked = p.checked;
    for (let i of document.getElementsByClassName('checkbox')) {
        i.checked = checked;
    }
}

function onDateChange(date) {
    window.localStorage.setItem('lastDate', date.value);
}

function setLastDate(dateSelector) {
    let d = window.localStorage.getItem('lastDate');
    if (d) {
        $(dateSelector).val(d);
    }
}

function setTomorrow(dateSelector, e) {
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    let day = tomorrow.getDate().toString();
    let month = tomorrow.getMonth().toString();
    let date = `${day.length === 1 ? '0' + day : day}.${month.length === 1 ? '0' + month : month}.${tomorrow.getFullYear()} 12:00:00`;
    localStorage.setItem('lastDate', date);
    $(dateSelector).val(date);
}

function ID () {
    return '_' + Math.random().toString(36).substr(2, 9);
};

function higlightLabel(src) {
    $(`label[for="${src.dataset.target}"]`)[0].classList.toggle("hover");
}

function clickLabel(src) {
    $(`label[for="${src.dataset.target}"]`)[0].click();
}

function labelClickEvent(event) {
    let id = $(event.target).attr('for');
    let input = $(`input[id="${id}"]`)[0];
    if (input.value !== '') {
        fileBackup[id] = $(input).clone();
    }
    event.stopPropagation();
}

function loadFilePreview(src) {
    if (src.files) {
        if (src.files[0]){
            let reader = new FileReader();
            
            reader.onload = (e) => {
                $(`#${src.id}-img`).attr('src', e.target.result);
                src.dataset.hasFile = true;
                let parent = $(src).parent();
                parent[0].dataset.hasFile = true;
                parent.find('.close-btn')[0].dataset.hasFile = true;
            };
            
            reader.readAsDataURL(src.files[0]);
        } else {
            fileBackup[src.id].insertBefore(src);
            $(src).remove();
        }
    }
}

function removeFile(event) {
    event.stopPropagation();
    event.currentTarget.dataset.hasFile = false;
    let target = event.currentTarget.dataset.target;
    let input = $('#' + target);
    input[0].dataset.hasFile = false;
    input.val('');
    let parent = input.parent()[0];
    parent.dataset.hasFile = false;
    $(`#${target}-img`).attr('src', '');
}

function setupDragAndDrop(target) {
    target = $('#' + target);
    let parent = target.parent();
    parent.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
    })
    .on('dragover dragenter', function() {
        parent.addClass('is-dragover');
    })
    .on('dragleave dragend drop', function() {
        parent.removeClass('is-dragover');
    })
    .on('drop', function(e) {
        if (e.originalEvent.dataTransfer.files.length) {
            // Dodać wsparcie ładowania plików z innych stron
            target[0].files = e.originalEvent.dataTransfer.files;
            target.trigger('onchange');
        }
    });
}

let fileList = {};
function addFileToList(src) {
    if (src.files) {
        for (let file of src.files) {
            let reader = new FileReader();
            let id = ID();
            fileList[id] = file;
            
            reader.onload = (e) => {
                $('#new-file-input-container').append($(`<span class="img-box" draggable="true">
                    <img src="${e.target.result}" id="${id}">
                    <div class="close-btn multiple-file-remove" aria-label="Delete" data-target="${id}" onclick="removeFileFromList(event);"></div>
                </span>`)).removeClass('display-none');
                src.dataset.hasFile = true;
                $(src).parent()[0].dataset.hasFile = true;
                // parent[0].dataset.hasFile = true;
            };
            
            reader.readAsDataURL(file);
        }
    }
    src.value = '';
}

function removeFileFromList(event) {
    event.stopPropagation();
    let id = event.currentTarget.dataset.target;
    delete fileList[id];
    $(event.currentTarget).parent().remove();
    let parent = $('#new-file-input-container');
    if (parent.children().length === 0) {
        parent.addClass('display-none');
        $('#new-file-input-parent')[0].dataset.hasFile = false;
    }
}

function getFormData() {
    let form = new FormData($('form')[0]);
    let init_files = form.get('files-TOTAL_FORMS');
    let f, file;
    // for (file = 0; file < init_files; ++file) {
    //     f = $(`#id_files-${file}-image`)[0].files[0];
    //     if (f) {
    //         form.append(`#id_files-${file}-image`, f || '\0', f.name);
    //     } else {
    //         form.append(`#id_files-${file}-image`, f || '\0');
    //     }
    // }

    file = init_files;

    for (let fileData of $('#new-file-input-container').find('img')) {
        ++file;
        f = fileList[fileData.id]
        form.append('image', f, f.name);
    }

    form.set('files-TOTAL_FORMS', file + 1);
    form.delete('new-file-input');
    return form;
}

function sendForm(url) {
    console.log(getFormData());
}