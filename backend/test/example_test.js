const chai = require('chai');
const sinon = require('sinon');
const Student = require('../models/Student');
const { createStudent } = require('../controllers/studentController');

const { expect } = chai;

describe('CreateStudent Function Test', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should create a new student successfully', async () => {
    const req = {
      body: {
        name: 'Test Student',
        studentId: 'S12345',
        email: 'student@test.com',
        course: 'IFN636',
        attendanceRate: 100,
        totalDays: 1,
        present: 1,
        absent: 0,
        late: 0,
      },
    };

    const createdStudent = { _id: 'abc123', ...req.body };
    const createStub = sinon.stub(Student, 'create').resolves(createdStudent);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createStudent(req, res);

    expect(createStub.calledOnceWith(req.body)).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdStudent)).to.be.true;
  });

  it('should return 400 when student creation fails', async () => {
    const req = {
      body: {
        name: 'Bad Student',
        studentId: 'S99999',
        email: 'bad@student.com',
        course: 'IFN636',
      },
    };

    sinon.stub(Student, 'create').throws(new Error('Creation failed'));

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
    };

    await createStudent(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledOnce).to.be.true;
  });
});
