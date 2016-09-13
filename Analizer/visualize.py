# -*- coding: utf-8 -*-

import wx

def click_b1(event):
    frame.SetStatusText('clicked')
    frame.Refresh()
    frame.Update()

application = wx.App()
frame = wx.Frame(None, wx.ID_ANY, u"results", size=(900, 600), pos=(0, 0))

frame.CreateStatusBar()
frame.SetStatusText("python-izm.com")

#icon = wx.Icon("./Analizer/index.jpeg", wx.BITMAP_TYPE_ICO)
#frame.SetIcon(icon)

notebook =wx.Notebook(frame, wx.ID_ANY)

panel_q = wx.Panel(notebook, wx.ID_ANY)
panel_q.SetBackgroundColour("#FFEECC")

panel_f = wx.Panel(notebook, wx.ID_ANY)
panel_f.SetBackgroundColour("#CCFFEE")


notebook.InsertPage(0, panel_q, "qualification")
notebook.InsertPage(1, panel_f, "final")


button_1 = wx.Button(panel_q, wx.ID_ANY, u"成績閲覧")
button_2 = wx.Button(panel_q, wx.ID_ANY, u"試合結果")

button_1.SetBackgroundColour("#EEEEEE")
button_2.SetBackgroundColour("#EEEEEE")

button_1.Bind(wx.EVT_BUTTON, click_b1)

layout_f = wx.BoxSizer(wx.VERTICAL)
layout_f.Add(button_1, proportion=1)
layout_f.Add(button_2, proportion=1)

"""
button_4 = wx.Button(panel, wx.ID_ANY, u"ボタン4")
button_5 = wx.Button(panel, wx.ID_ANY, u"ボタン5")
button_6 = wx.Button(panel, wx.ID_ANY, u"ボタン6")

layout_s = wx.BoxSizer(wx.VERTICAL)
layout_s.Add(button_4, proportion=1)
layout_s.Add(button_5, proportion=1)
layout_s.Add(button_6, proportion=1)

layout = wx.BoxSizer(wx.HORIZONTAL)
layout.Add(layout_f)
layout.Add(layout_s)
"""

image_list = wx.ImageList(16, 16)
icon_q = wx.Icon("./robotto.png", wx.BITMAP_TYPE_ICO)
icon_f = wx.Icon("./king.png", wx.BITMAP_TYPE_ICO)
image_list.AddIcon(icon_q)
image_list.AddIcon(icon_f)
notebook.AssignImageList(image_list)
notebook.SetPageImage(0, 0)
notebook.SetPageImage(1, 1)

panel_q.SetSizer(layout_f)

frame.SetStatusText('Select action')



frame.Show()

application.MainLoop()
