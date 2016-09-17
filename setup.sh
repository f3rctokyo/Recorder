#! /bin/bash

echo -n 'Please input the password. -> '
read resetpassword

if [ $resetpassword = 'lightning' ]; then
  echo 'resetting...'
  rm ./storage/qualification/*.json
else
  echo 'Wrong pass'
fi
