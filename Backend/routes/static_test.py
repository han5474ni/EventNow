from fastapi import APIRouter, HTTPException
import os
from typing import List

router = APIRouter(prefix="/api/static-test", tags=["Static Files Test"])

@router.get("/", response_model=List[dict])
def list_static_files():
    """List all static files in the static directory to help debug static file serving."""
    try:
        result = []
        static_dir = "static"
        
        if not os.path.exists(static_dir):
            return [{"error": f"Static directory '{static_dir}' does not exist"}]
        
        # Walk through the static directory and list all files
        for root, dirs, files in os.walk(static_dir):
            for file in files:
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, start=static_dir)
                result.append({
                    "path": f"/{static_dir}/{rel_path}",
                    "size": os.path.getsize(file_path),
                    "exists": True
                })
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing static files: {str(e)}")

@router.get("/check/{path:path}")
def check_static_file(path: str):
    """Check if a specific static file exists."""
    try:
        full_path = f"static/{path}"
        
        if os.path.exists(full_path):
            return {
                "path": f"/static/{path}",
                "size": os.path.getsize(full_path),
                "exists": True
            }
        else:
            return {
                "path": f"/static/{path}",
                "exists": False,
                "error": "File not found"
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error checking static file: {str(e)}")
