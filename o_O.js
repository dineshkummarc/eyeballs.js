var o_O = function(){

  if(typeof arguments[0] === 'string')
  {
    o_O.controller.initialize(arguments[0], arguments[1])
  }

  if(typeof arguments[0] === 'function')
  {
    return o_O.model.initialize(arguments[0])
  }
}

o_O.model = {
  initialize: function(callback){
    var callback = callback;
    var class_methods, instance_methods, initializer_methods;
    var validates_presence_of, validates_length_of;
  
    class_methods = {
      validations: {presence: [], lengthliness: [], custom: []},
      methods: {},
      validates_presence_of: function(field){
        this.validations.presence.push({field: field});
      },
      validates_length_of: function(field, options){
        options.field = field;
        this.validations.lengthliness.push(options);
      },
      validates: function(validation){
        this.validations.custom.push(validation)
      }
    }
  
    var config = callback(class_methods);
  
    instance_methods = {
      save: function(){
        if(this.valid())
        {
          return this;
        }
        else
        {
          return this;
        }
      },
      update_attributes: function(attributes){
        for(var attribute in attributes)
        {
          this[attribute] = attributes[attribute];
        }
        return this.save();
      },
      valid: function(){
        this.errors = [];
        
        o_O.validations.run(this);

        if(this.errors.length == 0)
        {
          return true;
        }
        else
        {
          return false;
        }
      },
      errors: [],
      validations: class_methods.validations
    }
    for(method in class_methods.methods)
    {
      instance_methods[method] = class_methods.methods[method]
    }
  
    initializer_methods = {
      initialize: function(attributes){
        if(!attributes) { var attributes = {}; };
        for ( var method in instance_methods ) {
          attributes[method] = instance_methods[method];
        }
        attributes['id'] = o_O.uuid();
        return attributes;
      },
      find: function(id){
        var object = {};
        template = $('[data-id=' + id + ']');
        return this.initialize(o_O.find_attributes(template, function(field){
          return field.text();
        }));
      }
    }
  
    return initializer_methods;
  }
}

o_O.validations = {
  run: function(object){
    this.run_custom_validations(object);
    this.run_length_validations(object);
    this.run_presence_validations(object);
  },
  run_custom_validations: function(object){
    for(i = 0; i < object.validations.custom.length; i++)
    {
      object.validations.custom[i](object);
    }
  },
  run_length_validations: function(object){
    for(i = 0; i < object.validations.lengthliness.length; i++)
    {
      var field = object.validations.lengthliness[i].field;
      var max = object.validations.lengthliness[i].max
      var min = object.validations.lengthliness[i].min
      if(object[field])
      {
        if(max && object[field].length > max)
        {
          var message = field + ' should be less than ' + max + ' characters';
          object.errors.push({field: field, type: 'length', message: message});
        }
        if(min && object[field].length < min)
        {
          var message = field + ' should be greater than ' + min + ' characters';
          object.errors.push({field: field, type: 'length', message: message});
        }
      }
    }
  },
  run_presence_validations: function(object){
    for(i = 0; i < object.validations.presence.length; i++)
    {
      var field = object.validations.presence[i].field;
      if(object[field] == '' || object[field] == null)
      {
        var message = field + ' should be present';
        object.errors.push({field: field, type: 'presence', message: message})
      }
    }
  }
}

o_O.templates = {}

o_O.get_template = function(template, callback){
  if(o_O.templates[template])
  {
    callback(o_O.templates[template]);
  }
  else
  {
    $.get('views/' + template + '.html.mustache', function(response){
      o_O.templates[template] = response;
      callback(response);
    });
  }
}

o_O._uuid_default_prefix = '';

o_O._uuidlet = function () {
  return(((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

o_O.uuid = function (p) {
  if (typeof(p) == 'object' && typeof(p.prefix) == 'string') {
    o_O._uuid_default_prefix = p.prefix;
  } else {
    p = p || o_O._uuid_default_prefix || '';
    return(p+o_O._uuidlet()+o_O._uuidlet()+"-"+o_O._uuidlet()+"-"+o_O._uuidlet()+"-"+o_O._uuidlet()+"-"+o_O._uuidlet()+o_O._uuidlet()+o_O._uuidlet());
  };
};