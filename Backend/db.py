from sqlalchemy import engine_from_config, pool
from sqlalchemy.orm import sessionmaker

def get_engine(settings):
    return engine_from_config(
        settings,
        prefix='sqlalchemy.',
        poolclass=pool.NullPool
    )

def get_session_factory(engine):
    return sessionmaker(bind=engine)
