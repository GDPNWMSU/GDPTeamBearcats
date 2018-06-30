<script type="text/javascript">
if(typeof Pace != 'undefined'){
Pace.on('hide', function(){
  $(".overlay").fadeOut(500,function(){
    $(this).remove();
  });
});
}
  document.getElementById("fileSelect").onchange = function()
  {
  alert(this.value);
  if(this.selectedIndex !== 0)
  {
    window.location.href = "Excel_Parser.php?file="+this.value;
  }
  };
</script>
