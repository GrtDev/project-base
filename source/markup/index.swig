{% extends 'templates/debug.swig' %}



{% block content %}


    <div class="_project-pages-list">

        {% include 'debug/pagesList.swig' %}

    </div>

    {% debug %}

{% endblock %}





