<!-- name: {{ project.name }}, version: {{ project.version }} -->
<!DOCTYPE html>
<html lang="{{ global.meta.language }}" dir="{{ global.meta.direction }}">

<head>

    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>

    <meta name="lang" content="{{ global.meta.language}}">
    <meta name="dir" content="{{ global.meta.direction }}">

    <meta name="author" content="{{ project.author }}">
    <meta name="description" content="{{ project.description }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

    <title>debug page</title>

    <!-- Style sheets -->
    <link rel="stylesheet" href="/css/{{ project.prefix }}/debug.css"/>
    <link rel="stylesheet" href="/css/{{ project.prefix }}/main.css"/>

</head>


<body>



    <main role="main">

        {% block content %}

            <!-- content will be injected in this block -->

        {% endblock %}

    </main>



    <script src="/js/{{ project.prefix }}/main.js" type="text/javascript"></script>

</body>

</html>