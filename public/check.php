<?php
$matchnum = mb_convert_kana($_REQUEST['matchnum'], 'n', 'utf-8');

if (is_numeric($matchnum)) {
  
} else {
  print('please input number');
}
?>
