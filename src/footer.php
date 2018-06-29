<script type="text/javascript">
if(typeof Pace != 'undefined'){
Pace.on('hide', function(){
  $(".overlay").fadeOut(500,function(){
    $(this).remove();
  });
});
}
</script>
