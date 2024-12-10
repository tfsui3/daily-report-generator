# Daily Report Generator

这是一个用于自动生成日报的 Tampermonkey 脚本，专门为 KwickPOS 系统设计。

## 快速安装

1. 首先安装 Tampermonkey 浏览器扩展
   - [Chrome版本](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
   - [Firefox版本](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
   - [Edge版本](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

2. 点击下面的链接安装脚本：
   [点击安装脚本](https://raw.githubusercontent.com/tfsui3/daily-report-generator/main/daily-report.user.js)

## 功能特点

- 自动生成指定日期的工作报告
- 支持按用户名筛选工单
- 自动保存用户名和值班信息
- 一键复制报告内容
- 智能格式化报告内容

## 使用方法

1. 进入工单页面后，页面顶部会出现生成报告的控制面板
2. 输入以下信息：
   - 日期 (MM-DD格式)
   - 用户名
   - 值班信息 (S/N...)
3. 点击 "Generate Daily Report" 按钮生成报告
4. 使用 "Copy Report" 按钮复制报告内容

## 注意事项

- 日期格式必须是 MM-DD（例如：12-25）
- 用户名会自动保存到浏览器，下次使用时自动填充
- 值班信息同样会被保存
- 脚本会自动检查更新

## 更新历史

- v0.5: 初始版本发布
  - 基础报告生成功能
  - 自动保存用户偏好
  - 一键复制功能

## 问题反馈

如果遇到任何问题或有建议，请在 GitHub Issues 中提出。