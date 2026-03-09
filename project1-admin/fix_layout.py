import sys
import re

files_to_check = [
    '/Users/sherkhan/Documents/sherKhan/project1-admin/src/pages/AllUser.jsx',
    '/Users/sherkhan/Documents/sherKhan/project1-admin/src/pages/UserManage.jsx',
    '/Users/sherkhan/Documents/sherKhan/project1-admin/src/pages/NewUser.jsx',
    '/Users/sherkhan/Documents/sherKhan/project1-admin/src/pages/NoDepositUser.jsx',
    '/Users/sherkhan/Documents/sherKhan/project1-admin/src/pages/ManualUser.jsx'
]

for file_path in files_to_check:
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Replace the container width to prevent squeezing
    content = content.replace('min-w-[90px] gap-[4px]', 'min-w-[170px] gap-[4px]')
    
    # Add shrink-0 to action buttons
    content = content.replace('w-7 flex items-center', 'w-7 h-7 flex-shrink-0 flex items-center')
    content = content.replace('className={"w-7 h-7"}', 'className={"w-7 h-7 flex-shrink-0"}')
    content = content.replace('className="w-7 h-7"', 'className="w-7 h-7 flex-shrink-0"')
    
    # Also fix width for previously w-[25px] where not yet updated to w-7
    content = content.replace('min-w-[150px] w-[100%] gap-1', 'min-w-[150px] gap-1') # let flex share evenly
    
    # Prevent the container from getting squished by other w-[100%] cols
    # The columns: 
    # 1. User info: min-w-[150px] w-[100%]
    # 2. Joining Date: min-w-[190px] w-[100%]
    # 3. Balance: min-w-[140px] w-[100%]
    # 4. Status: min-w-[100px]
    # 5. Actions: min-w-[170px] -> maybe add shrink-0 to the action container too
    content = content.replace('min-w-[170px] gap-[4px] ml-auto', 'min-w-[170px] gap-[4px] ml-auto shrink-0')

    # Update ChangePassword and DeleteUser customStyles to shrink:0
    content = content.replace("width: '28px', height: '28px'", "flexShrink: 0, width: '28px', height: '28px'")

    # Save
    with open(file_path, 'w') as f:
        f.write(content)
print("Finished replacing layout styles.")
