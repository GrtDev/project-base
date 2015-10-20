<!-- name: {{ project.name }}, version: {{ project.version }} -->
<!DOCTYPE html>
<html lang="{{ global.meta.language }}" dir="{{ global.meta.direction }}">

<head>

    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>

    <meta name="lang" content="en">
    <meta name="dir" content="ltr">

    <meta name="author" content="{{ project.author }}">
    <meta name="description" content="{{ project.description }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">


    <!-- You can use open graph tags to customize link previews.
   Learn more: https://developers.facebook.com/docs/sharing/webmasters -->
    <meta property="og:url"           content="http://www.your-domain.com/your-page.html" />
    <meta property="og:type"          content="website" />
    <meta property="og:title"         content="{{ global.title }}" />
    <meta property="og:description"   content="{{ project.description }}" />
    <meta property="og:image"         content="http://www.your-domain.com/path/image.jpg" />


    <title>{{ global.title }}</title>

    <!-- Style sheets -->
    {% if project.debug %} <link rel="stylesheet" href="/css/debug.css"/> {% endif %}

    <link rel="stylesheet" href="/css/main.css"/>

</head>


<body>
    <!-- Google Tag Manager  @formatter:off -->
    <noscript><iframe src="//www.googletagmanager.com/ns.html?id={{ global['GTM-id'] }}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='//www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', '{{ global['GTM-id'] }}');</script>
    <!-- End Google Tag Manager  @formatter:on -->


    <!-- set DEBUG to true when the project is compiled in debug mode. -->
    {% if project.debug %}
        <script> var DEBUG = true; </script>
    {% endif %}



    {% include "layout/header.swig" %}


    <main role="main">

        {% block content %}

        <!-- content will be injected in this block -->

        {% endblock %}

    </main>



    {% include "layout/footer.swig" %}


    <script src="/js/{{ project.prefix }}/main.js" type="text/javascript"></script>

</body>

</html>