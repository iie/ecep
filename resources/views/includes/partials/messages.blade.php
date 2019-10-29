@if ($errors->any())
    <div class="alert alert-danger">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>

        @foreach ($errors->all() as $error)
            {!! $error !!}<br/>
        @endforeach
    </div>
@elseif (session()->get('flash_success'))
    <div class="alert alert-success">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>

        @if(is_array(json_decode(session()->get('flash_success'), true)))
            {!! implode('', session()->get('flash_success')->all(':message<br/>')) !!}
        @else
            {!! session()->get('flash_success') !!}
        @endif
    </div>
@elseif (session()->get('flash_warning'))
    <div class="alert alert-warning">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>

        @if(is_array(json_decode(session()->get('flash_warning'), true)))
            {!! implode('', session()->get('flash_warning')->all(':message<br/>')) !!}
        @else
            {!! session()->get('flash_warning') !!}
        @endif
    </div>
@elseif (session()->get('flash_info'))
    <div class="alert alert-info">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>

        @if(is_array(json_decode(session()->get('flash_info'), true)))
            {!! implode('', session()->get('flash_info')->all(':message<br/>')) !!}
        @else
            {!! session()->get('flash_info') !!}
        @endif
    </div>
@elseif (session()->get('flash_danger'))
    <div class="alert alert-danger">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>

        @if(is_array(json_decode(session()->get('flash_danger'), true)))
            {!! implode('', session()->get('flash_danger')->all(':message<br/>')) !!}
        @else
            {!! session()->get('flash_danger') !!}
        @endif
    </div>
@elseif (session()->get('flash_message'))
    <div class="alert alert-info">
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>

        @if(is_array(json_decode(session()->get('flash_message'), true)))
            {!! implode('', session()->get('flash_message')->all(':message<br/>')) !!}
        @else
            {!! session()->get('flash_message') !!}
        @endif
    </div>
@endif

<script type="text/javascript">
    
    function flashMessage(element, type, message){

        var messageDiv = document.createElement('div');
        messageDiv.classList.add('alert');
        messageDiv.classList.add('alert-'+type);

        var messageButton = document.createElement('button');
        messageButton.type = 'button';
        messageButton.className = 'close';
        messageButton.dataset.dismiss = 'alert';
        messageButton.setAttribute('aria-label', 'close');
        
        var messageCloseIcon = document.createElement('span');
        messageCloseIcon.setAttribute('aria-hidden', 'true');
        messageCloseIcon.innerHTML = '×';

        var messageTextNode = document.createTextNode(message);

        messageButton.appendChild(messageCloseIcon);

        messageDiv.appendChild(messageButton);

        messageDiv.appendChild(messageTextNode); 

        element.insertBefore(messageDiv, element);
    }


</script>