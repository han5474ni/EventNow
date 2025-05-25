from setuptools import setup, find_packages

setup(
    name="backend",
    version="0.1",
    packages=find_packages(),
    install_requires=[
        'fastapi>=0.95.0',
        'sqlalchemy>=2.0.9',
        'alembic>=1.10.3',
        'python-dotenv>=1.0.0',
    ],
)
