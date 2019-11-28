!macro customInstall
  DetailPrint "Register deskfiler URI Handler"
  DeleteRegKey HKCR "deskfiler"
  WriteRegStr HKCR "deskfiler" "" "URL:deskfiler"
  WriteRegStr HKCR "deskfiler" "URL Protocol" ""
  WriteRegStr HKCR "deskfiler\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCR "deskfiler\shell" "" ""
  WriteRegStr HKCR "deskfiler\shell\Open" "" ""
  WriteRegStr HKCR "deskfiler\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend